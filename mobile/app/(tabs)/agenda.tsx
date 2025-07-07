import { ChevronLeft } from 'lucide-react-native';
import CalendarList from 'components/agenda/calendar';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/mobile/constants/Colors';

export default function AgendaScreen() {
    const [selectedDate, setSelectedDate] = useState(new Date());

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
