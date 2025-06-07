import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import CalendarList from 'components/agenda/calendar';
import { router } from 'expo-router';
import { ChevronLeft } from '@/mobile/components/icons/ChevronLeft';

export default function AgendaScreen() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.backIconContainer}>
                    <ChevronLeft onPress={() => router.back()} />
                </View>
                <Text style={styles.title}>Agenda</Text>
            </View>

            <CalendarList
                selectedDate={selectedDate}
                onDateSelect={() => router.navigate('/tracking/[date].tsx')}
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
        paddingBottom: 8,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    backIconContainer: {
        marginRight: 4,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Inter-Bold',
        color: '#111827',
    },
});
