import { ChevronLeft } from 'lucide-react-native';
import CalendarList from 'components/agenda/calendar';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/mobile/constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { apiService } from '@/mobile/services/api';
import { storageService } from '@/mobile/services/storage';

export default function AgendaScreen() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [trackedDays, setTrackedDays] = useState<string[]>([]);

    const loadTrackedDays = async () => {
        try {
            const token = await storageService.getAuthToken();
            if (!token) return;

            try {
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();

                const trackingData = await apiService.getDailyTracking(token, currentDate.toISOString().slice(0, 10));

                if (trackingData) {
                    const days = [currentDate.toDateString()];
                    setTrackedDays(days);
                } else {
                    setTrackedDays([]);
                }
            } catch (error) {
                console.error('Error loading tracked days from API:', error);
                setTrackedDays([]);
            }
        } catch (error) {
            console.error('Error loading tracked days:', error);
            setTrackedDays([]);
        }
    };

    useEffect(() => {
        loadTrackedDays();
    }, []);

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
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: '#F9FAFB',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Inter-Bold',
        color: '#111827',
        textAlign: 'left',
    },
});
