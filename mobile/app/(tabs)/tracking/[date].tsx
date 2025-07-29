import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/mobile/constants/Colors';
import { apiService } from '@/mobile/services/api';
import { storageService } from '@/mobile/services/storage';
import TrackingSection from '@/mobile/components/daily-tracking/tracking-section';
import { ChevronLeft } from "lucide-react-native";
import { Dumbbell, Frown, Heart, Laptop, Meh, Smile, Wine, WineOff } from 'lucide-react-native';

async function getMonthTrackingData(year: number, month: number) {
    try {
        const token = await storageService.getAuthToken();
        if (!token) return {};

        const currentDate = new Date(year, month, 1);
        const trackingData = await apiService.getDailyTracking(token, currentDate.toISOString().slice(0, 10));

        if (trackingData) {
            return { [currentDate.toISOString().slice(0, 10)]: trackingData };
        }

        return {};
    } catch (error) {
        console.error('Error loading month data:', error);
        return {};
    }
}

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
    const [loading, setLoading] = useState(false);
    const [tracking, setTracking] = useState<DailyTracking>({
        alcohol: null,
        exercise: null,
        mood: null,
        sleep: null,
    });
    const [hasExistingData, setHasExistingData] = useState(false);
    const [monthData, setMonthData] = useState<{ [key: string]: any }>({});

    // Função para formatar a data como YYYY-MM-DD
    function formatDate(date: Date) {
        return date.toISOString().slice(0, 10);
    }

    // Carrega o registro do dia ao abrir ou trocar de data
    useEffect(() => {
        setLoading(true);

        const loadTrackingData = async () => {
            try {
                const token = await storageService.getAuthToken();
                if (!token) return;

                const data = await apiService.getDailyTracking(token, formatDate(selectedDate));
                if (data) {
                    setTracking(data);
                    setHasExistingData(true);
                } else {
                    setTracking({ alcohol: null, exercise: null, mood: null, sleep: null });
                    setHasExistingData(false);
                }
            } catch (error) {
                console.error('Error loading tracking data:', error);
                Alert.alert('Erro', 'Não foi possível carregar os dados. Verifique se você está logado.');
                setHasExistingData(false);
            } finally {
                setLoading(false);
            }
        };

        loadTrackingData();
    }, [selectedDate]);

    // Carrega os dados do mês para marcar os dias no calendário
    useEffect(() => {
        const loadMonthData = async () => {
            try {
                const year = selectedDate.getFullYear();
                const month = selectedDate.getMonth();
                const data = await getMonthTrackingData(year, month);
                setMonthData(data);
            } catch (error) {
                console.error('Error loading month data:', error);
            }
        };

        loadMonthData();
    }, [selectedDate.getFullYear(), selectedDate.getMonth()]);

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
    const buttonEnabled = allSelected && !loading;
    const buttonText = loading ? 'Salvando...' : (hasExistingData ? 'Atualizar' : 'Salvar');

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = await storageService.getAuthToken();
            if (!token) {
                Alert.alert('Erro', 'Token de autenticação não encontrado');
                return;
            }

            await apiService.saveDailyTracking(token, formatDate(selectedDate), tracking);
            setHasExistingData(true);

            Alert.alert('Sucesso', 'Dados salvos com sucesso!');
        } catch (error) {
            console.error('Error saving tracking data:', error);
            Alert.alert('Erro', 'Não foi possível salvar os dados. Tente novamente.');
        } finally {
            setLoading(false);
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
                        const dateStr = formatDate(d.fullDate);
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
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    backButton: {
        padding: 8,
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
    dayButtonToday: {
        backgroundColor: '#3B82F6',
    },
    dayButtonSelected: {
        borderWidth: 3,
        borderColor: '#1F2937',
        backgroundColor: '#F3F4F6',
    },
    dayButtonWithData: {
        backgroundColor: '#10B981',
    },
    dayNumber: {
        fontSize: 16,
        color: '#595858',
        fontFamily: 'Inter',
        backgroundColor: 'transparent',
    },
    dayNumberToday: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },
    dayNumberSelected: {
        color: '#1F2937',
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