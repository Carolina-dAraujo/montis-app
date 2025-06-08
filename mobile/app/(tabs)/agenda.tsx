import { ChevronLeft } from '@/mobile/components/icons/ChevronLeft';
import CalendarList from 'components/agenda/calendar';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AgendaScreen() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        router.push({ pathname: '/tracking/[date]', params: { date: date.toISOString() } });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backIconContainer} onPress={() => router.replace('/home')}>
                    <ChevronLeft />
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 8,
        backgroundColor: '#F9FAFB',
    },
    backIconContainer: {
        marginRight: 8,
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: 32,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Inter-Bold',
        color: '#111827',
        flex: 1,
    },
});
