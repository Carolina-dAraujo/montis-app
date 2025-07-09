import { ChevronLeft } from 'lucide-react-native';
import CalendarList from 'components/agenda/calendar';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/mobile/constants/Colors';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, child } from 'firebase/database';
import { useFocusEffect } from '@react-navigation/native';

export default function AgendaScreen() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [trackedDays, setTrackedDays] = useState<string[]>([]);

    // Função para buscar todos os dias que têm dados salvos
    const loadTrackedDays = async () => {
        try {
            const user = getAuth().currentUser;
            if (!user) return;
            
            const dbRef = ref(getDatabase());
            const snapshot = await get(child(dbRef, `users/${user.uid}/dailyTracking`));
            
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log('Raw data from Firebase:', data);
                const days = Object.keys(data).map(dateStr => {
                    // Converter YYYY-MM-DD para Date sem problemas de fuso horário
                    const [year, month, day] = dateStr.split('-').map(Number);
                    const date = new Date(year, month - 1, day); // month - 1 porque Date usa 0-11
                    const dateString = date.toDateString();
                    console.log(`Converting ${dateStr} -> ${dateString}`);
                    return dateString;
                });
                console.log('Final tracked days:', days);
                setTrackedDays(days);
            }
        } catch (error) {
            console.error('Error loading tracked days:', error);
        }
    };

    useEffect(() => {
        loadTrackedDays();
    }, []);

    // Recarregar dados quando a tela ganhar foco (quando voltar do tracking)
    useFocusEffect(
        React.useCallback(() => {
            loadTrackedDays();
        }, [])
    );

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        router.push({ pathname: '/tracking/[date]', params: { date: date.toISOString() } });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backIconContainer} 
                    onPress={() => router.navigate('/home')}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    				<TouchableOpacity style={styles.backButton}>
					<ChevronLeft size={24} color={Colors.icon.gray} />
				</TouchableOpacity>
                </TouchableOpacity>
                <Text style={styles.title}>Agenda</Text>
            </View>

            <CalendarList
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                trackedDays={trackedDays}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingBottom: 8,
        backgroundColor: '#F9FAFB',
    },
    	backIconContainer: {
		marginBottom: 8,
		alignItems: 'center',
		justifyContent: 'center',
		width: 40,
		height: 40,
		zIndex: 1,
	},
	backButton: {
		padding: 8,
	},
    title: {
        fontSize: 20,
        fontFamily: 'Inter-Bold',
        color: '#111827',
        textAlign: 'left',
    },
});
