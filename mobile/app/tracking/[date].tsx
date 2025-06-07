import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import TrackingSection from 'components/daily-tracking/tracking-section';
import { Wine, WineOff, Dumbbell, Laptop, Smile, Meh, Frown, Heart } from 'lucide-react-native';

interface DailyTracking {
    alcohol: 'none' | 'light' | 'moderate' | 'heavy';
    exercise: 'none' | 'light' | 'moderate' | 'intense';
    mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
    sleep: number;
}

export default function TrackingScreen() {
    const [tracking, setTracking] = useState<DailyTracking>({
        alcohol: 'none',
        exercise: 'moderate',
        mood: 'good',
        sleep: 7,
    });

    const alcoholOptions = [
        { id: 'none', label: 'Nenhum', icon: WineOff, color: '#10B981' },
        { id: 'light', label: 'Leve', icon: Wine, color: '#F59E0B' },
        { id: 'moderate', label: 'Moderado', icon: Wine, color: '#F97316' },
        { id: 'heavy', label: 'Intenso', icon: Wine, color: '#EF4444' },
    ];

    const exerciseOptions = [
        { id: 'none', label: 'Nenhum', icon: Laptop, color: '#6B7280' },
        { id: 'light', label: 'Leve', icon: Dumbbell, color: '#10B981' },
        { id: 'moderate', label: 'Moderado', icon: Dumbbell, color: '#2563EB' },
        { id: 'intense', label: 'Intenso', icon: Dumbbell, color: '#7C3AED' },
    ];

    const moodOptions = [
        { id: 'great', label: 'Excelente', icon: Heart, color: '#10B981' },
        { id: 'good', label: 'Bom', icon: Smile, color: '#22C55E' },
        { id: 'neutral', label: 'Neutro', icon: Meh, color: '#F59E0B' },
        { id: 'bad', label: 'Ruim', icon: Frown, color: '#F97316' },
        { id: 'terrible', label: 'Terrível', icon: Frown, color: '#EF4444' },
    ];

    const updateTracking = (field: keyof DailyTracking, value: any) => {
        setTracking(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // Here you would save to your backend/storage
        console.log('Saving tracking data:', tracking);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Registro Diário</Text>
                    <Text style={styles.subtitle}>Hoje, 9 de fevereiro de 2025</Text>
                </View>

                <View style={styles.content}>
                    <TrackingSection
                        title="Consumo de Álcool"
                        options={alcoholOptions}
                        selectedValue={tracking.alcohol}
                        onValueChange={(value) => updateTracking('alcohol', value)}
                    />

                    <TrackingSection
                        title="Exercício Físico"
                        options={exerciseOptions}
                        selectedValue={tracking.exercise}
                        onValueChange={(value) => updateTracking('exercise', value)}
                    />

                    <TrackingSection
                        title="Sentimentos"
                        options={moodOptions}
                        selectedValue={tracking.mood}
                        onValueChange={(value) => updateTracking('mood', value)}
                    />

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Registrar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        padding: 24,
        paddingBottom: 16,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Inter-Bold',
        color: '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: '#6B7280',
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    saveButton: {
        backgroundColor: '#2563EB',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 32,
        shadowColor: '#2563EB',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
    },
});