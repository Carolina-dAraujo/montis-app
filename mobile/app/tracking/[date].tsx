import TrackingSection from '@/mobile/components/daily-tracking/tracking-section';
import { ChevronLeft } from "@/mobile/components/icons/ChevronLeft";
import { router, useLocalSearchParams } from "expo-router";
import { Dumbbell, Frown, Heart, Laptop, Meh, Smile, Wine, WineOff } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function getCurrentWeekDays(selectedDate: Date) {
    const week = [];
    const start = new Date(selectedDate);
    start.setDate(selectedDate.getDate() - selectedDate.getDay()); // Sunday
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        week.push({
            label: WEEKDAYS[i],
            date: d.getDate(),
            fullDate: d,
        });
    }
    return week;
}

interface DailyTracking {
    alcohol: 'none' | 'light' | 'moderate' | 'heavy' | null;
    exercise: 'none' | 'light' | 'moderate' | 'intense' | null;
    mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible' | null;
    sleep: number | null;
}

export default function TrackingScreen() {
    const { date } = useLocalSearchParams();
    const initialDate = date ? new Date(date as string) : new Date();
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [trackingByDate, setTrackingByDate] = useState<Record<string, DailyTracking>>({});
    const prevTracking = trackingByDate[selectedDate.toDateString()];
    const [tracking, setTracking] = useState<DailyTracking>(
        prevTracking || {
            alcohol: null,
            exercise: null,
            mood: null,
            sleep: null,
        }
    );

    useEffect(() => {
        const prev = trackingByDate[selectedDate.toDateString()];
        setTracking(
            prev || {
                alcohol: null,
                exercise: null,
                mood: null,
                sleep: null,
            }
        );
    }, [selectedDate, trackingByDate]);

    const alcoholOptions = [
        { id: 'none', label: 'Abstinência', icon: WineOff, color: '#77aae3' },
        { id: 'light', label: 'Consumo leve', icon: Wine, color: '#548cc5' },
        { id: 'moderate', label: 'Consumo moderado', icon: Wine, color: '#3A6EA5' },
        { id: 'heavy', label: 'Consumo intenso', icon: Wine, color: '#254A8E' },
    ];

    const exerciseOptions = [
        { id: 'none', label: 'Sem exercício', icon: Laptop, color: '#77aae3' },
        { id: 'light', label: 'Leve', icon: Dumbbell, color: '#548cc5' },
        { id: 'moderate', label: 'Moderado', icon: Dumbbell, color: '#3A6EA5' },
        { id: 'intense', label: 'Intenso', icon: Dumbbell, color: '#254A8E' },
    ];

    const moodOptions = [
        { id: 'great', label: 'Ótimo', icon: Heart, color: '#97c6fb' },
        { id: 'good', label: 'Bem', icon: Smile, color: '#77aae3' },
        { id: 'neutral', label: 'Ok', icon: Meh, color: '#548cc5' },
        { id: 'bad', label: 'Mal', icon: Frown, color: '#3A6EA5' },
        { id: 'terrible', label: 'Estressado', icon: Frown, color: '#254A8E' },
    ];

    const updateTracking = (field: keyof DailyTracking, value: any) => {
        setTracking(prev => ({ ...prev, [field]: value }));
    };

    const allSelected = tracking.alcohol && tracking.exercise && tracking.mood;
    const isUpdate = !!prevTracking;
    const changed =
        isUpdate && prevTracking
            ? prevTracking.alcohol !== tracking.alcohol ||
              prevTracking.exercise !== tracking.exercise ||
              prevTracking.mood !== tracking.mood
            : allSelected;
    const buttonEnabled = allSelected && (!isUpdate || changed);
    const buttonText = isUpdate ? 'Atualizar' : 'Registrar';

    const handleSave = () => {
        if (!buttonEnabled) return;
        setTrackingByDate(prev => ({
            ...prev,
            [selectedDate.toDateString()]: tracking,
        }));
        console.log('Saving tracking data:', tracking);
    };

    const weekDays = getCurrentWeekDays(selectedDate);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backIconWrapper} onPress={() => router.back()}>
                        <ChevronLeft />
                    </TouchableOpacity>
                    <Text style={styles.dateText} numberOfLines={2}>
                        {selectedDate.toDateString() === new Date().toDateString()
                            ? `Hoje, ${selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}`
                            : selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </Text>
                    <View style={{ width: 32 }} />
                </View>
                <View style={styles.weekdaysRow}>
                    {weekDays.map((d, idx) => (
                        <View key={d.label + idx} style={styles.weekdayCell}>
                            <Text style={styles.weekdayText}>{d.label}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.datesRow}>
                    {weekDays.map((d, idx) => (
                        <TouchableOpacity
                            key={d.label + d.date}
                            style={[styles.dayButton, d.fullDate.toDateString() === selectedDate.toDateString() && styles.dayButtonSelected]}
                            onPress={() => setSelectedDate(new Date(d.fullDate))}
                        >
                            <Text style={[styles.dayNumber, d.fullDate.toDateString() === selectedDate.toDateString() && styles.dayNumberSelected]}>{d.date}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: 32, paddingTop: 0 }]}
            >
                <View style={styles.content}>
                    <TrackingSection
                        title="Consumo de álcool"
                        options={alcoholOptions}
                        selectedValue={tracking.alcohol as string}
                        onValueChange={(value) => updateTracking('alcohol', value)}
                    />
                    <TrackingSection
                        title="Exercício físico"
                        options={exerciseOptions}
                        selectedValue={tracking.exercise as string}
                        onValueChange={(value) => updateTracking('exercise', value)}
                    />
                    <TrackingSection
                        title="Sentimentos"
                        options={moodOptions}
                        selectedValue={tracking.mood as string}
                        onValueChange={(value) => updateTracking('mood', value)}
                    />
                    <View style={styles.saveButtonContainerScroll}>
                        <TouchableOpacity
                            style={[styles.saveButton, !buttonEnabled ? styles.saveButtonInactive : styles.saveButtonActive]}
                            onPress={handleSave}
                            disabled={!buttonEnabled}
                        >
                            <Text style={[styles.saveButtonText, !buttonEnabled ? styles.saveButtonTextInactive : styles.saveButtonTextActive]}>{buttonText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 0,
        backgroundColor: '#fff',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        backgroundColor: '#fff',
        minHeight: 48,
    },
    backIconWrapper: {
        width: 32,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    dateText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Inter',
        fontWeight: 'semibold',
        color: '#000000',
        backgroundColor: '#fff',
    },
    weekdaysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 4,
        marginBottom: 2,
        backgroundColor: '#fff',
    },
    weekdayCell: {
        width: 46,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    weekdayText: {
        fontSize: 13,
        color: '#000000',
        fontFamily: 'Inter-Medium',
        backgroundColor: '#fff',
    },
    datesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 4,
        marginBottom: 8,
        backgroundColor: '#fff',
    },
    dayButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        borderWidth: 0,
        backgroundColor: '#E3E3E3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayButtonSelected: {
        borderWidth: 3,
        borderColor: '#595858',
        backgroundColor: '#E3E3E3',
    },
    dayNumber: {
        fontSize: 16,
        color: '#595858',
        fontFamily: 'Inter',
        backgroundColor: 'transparent',
    },
    dayNumberSelected: {
        color: '#595858',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },
    scrollContent: {
        paddingBottom: 120,
        backgroundColor: '#fff',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 32,
        backgroundColor: '#fff',
        paddingTop: 0,
    },
    saveButtonContainerScroll: {
        marginTop: 24,
        marginBottom: 24,
    },
    saveButton: {
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    saveButtonActive: {
        backgroundColor: '#254A8E',
    },
    saveButtonInactive: {
        backgroundColor: '#D1D5DB',
    },
    saveButtonText: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
    },
    saveButtonTextActive: {
        color: '#fff',
    },
    saveButtonTextInactive: {
        color: '#fff',
    },
});
