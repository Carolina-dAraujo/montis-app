import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/shared/theme/colors';
import type { DailyTrackingRecord } from '@/features/tracking/api';
import TrackingSection from '@/features/tracking/components/tracking-section';
import { ChevronLeft } from "lucide-react-native";
import { Dumbbell, Frown, Heart, Laptop, Meh, Smile, Wine, WineOff } from 'lucide-react-native';
import { styles } from '@/features/tracking/styles/dailyTracking.styles';
import {
	useDailyTracking,
	formatTrackingDate,
} from '@/features/tracking/hooks/useDailyTracking';

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function getCurrentWeekDays(selectedDate: Date) {
    const week = [];
    const start = new Date(selectedDate);
    start.setDate(selectedDate.getDate() - selectedDate.getDay());
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

type DailyTracking = {
    alcohol: DailyTrackingRecord['alcohol'] | null;
    exercise: DailyTrackingRecord['exercise'] | null;
    mood: DailyTrackingRecord['mood'] | null;
    sleep: number | null;
};

export default function DailyTracking() {
    const { date } = useLocalSearchParams();
    const initialDate = date ? new Date(date as string) : new Date();
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [tracking, setTracking] = useState<DailyTracking>({
        alcohol: null,
        exercise: null,
        mood: null,
        sleep: null,
    });
    const [hasExistingData, setHasExistingData] = useState(false);

    const { dailyData, monthData, isLoading, isSaving, saveTracking } =
        useDailyTracking(selectedDate);

    useEffect(() => {
        if (dailyData) {
            setTracking({
                alcohol: dailyData.alcohol,
                exercise: dailyData.exercise,
                mood: dailyData.mood,
                sleep: dailyData.sleep ?? null,
            });
            setHasExistingData(true);
        } else if (!isLoading) {
            setTracking({ alcohol: null, exercise: null, mood: null, sleep: null });
            setHasExistingData(false);
        }
    }, [dailyData, isLoading]);

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

    const updateTracking = <K extends keyof DailyTracking>(
        field: K,
        value: DailyTracking[K],
    ) => {
        setTracking(prev => ({ ...prev, [field]: value }));
    };

    const allSelected = tracking.alcohol && tracking.exercise && tracking.mood;
    const saving = isLoading || isSaving;
    const buttonEnabled = allSelected && !saving;
    const buttonText = saving ? 'Salvando...' : (hasExistingData ? 'Atualizar' : 'Salvar');

    const handleSave = async () => {
        try {
            await saveTracking({
                alcohol: tracking.alcohol!,
                exercise: tracking.exercise!,
                mood: tracking.mood!,
                sleep: tracking.sleep,
            });
            setHasExistingData(true);
            Alert.alert('Sucesso', 'Dados salvos com sucesso!');
        } catch (error) {
            console.error('Error saving tracking data:', error);
            Alert.alert('Erro', 'Não foi possível salvar os dados. Tente novamente.');
        }
    };

    const weekDays = getCurrentWeekDays(selectedDate);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity
                        style={styles.backIconWrapper}
                        onPress={() => router.push('/(tabs)/agenda')}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <ChevronLeft size={24} color={Colors.icon.gray} />
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
                    {weekDays.map((d, idx) => {
                        const dateStr = formatTrackingDate(d.fullDate);
                        const hasData = monthData[dateStr];
                        const isToday = d.fullDate.toDateString() === new Date().toDateString();
                        const isSelected = d.fullDate.toDateString() === selectedDate.toDateString();

                        return (
                            <TouchableOpacity
                                key={d.label + d.date}
                                style={[
                                    styles.dayButton,
                                    isToday && styles.dayButtonToday,
                                    isSelected && styles.dayButtonSelected,
                                    hasData && !isToday && styles.dayButtonWithData
                                ]}
                                onPress={() => setSelectedDate(new Date(d.fullDate))}
                            >
                                <Text style={[
                                    styles.dayNumber,
                                    isToday && styles.dayNumberToday,
                                    isSelected && styles.dayNumberSelected
                                ]}>{d.date}</Text>
                            </TouchableOpacity>
                        );
                    })}
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
                        onValueChange={(value) => updateTracking('alcohol', value as DailyTracking['alcohol'])}
                    />
                    <TrackingSection
                        title="Exercício físico"
                        options={exerciseOptions}
                        selectedValue={tracking.exercise as string}
                        onValueChange={(value) => updateTracking('exercise', value as DailyTracking['exercise'])}
                    />
                    <TrackingSection
                        title="Sentimentos"
                        options={moodOptions}
                        selectedValue={tracking.mood as string}
                        onValueChange={(value) => updateTracking('mood', value as DailyTracking['mood'])}
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
