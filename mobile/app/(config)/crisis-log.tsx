import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/mobile/constants/Colors';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react-native';

interface CrisisEntry {
    id: string;
    date: string;
    time: string;
    severity: 'low' | 'medium' | 'high';
    triggers: string;
    symptoms: string;
    copingStrategies: string;
    notes: string;
}

const CrisisLogScreen = () => {
    const [entries, setEntries] = useState<CrisisEntry[]>([
        {
            id: '1',
            date: '2024-01-15',
            time: '14:30',
            severity: 'high',
            triggers: 'Conflito no trabalho, falta de sono',
            symptoms: 'Ansiedade, taquicardia, pensamentos acelerados',
            copingStrategies: 'Respiração 4-7-8, liguei para amigo',
            notes: 'Crise durou cerca de 2 horas. Melhorou após exercício de respiração.'
        },
        {
            id: '2',
            date: '2024-01-12',
            time: '09:15',
            severity: 'medium',
            triggers: 'Reunião importante, pressão social',
            symptoms: 'Nervosismo, sudorese, dificuldade para concentrar',
            copingStrategies: 'Técnica 5-4-3-2-1, caminhada',
            notes: 'Crise controlada em 30 minutos.'
        }
    ]);
    const [isAddingEntry, setIsAddingEntry] = useState(false);
    const [newEntry, setNewEntry] = useState({
        severity: 'medium' as 'low' | 'medium' | 'high',
        triggers: '',
        symptoms: '',
        copingStrategies: '',
        notes: ''
    });

    const severityColors = {
        low: '#4CAF50',
        medium: '#FF9800',
        high: '#F44336'
    };

    const severityLabels = {
        low: 'Baixa',
        medium: 'Média',
        high: 'Alta'
    };

    const handleAddEntry = () => {
        if (!newEntry.triggers || !newEntry.symptoms) {
            Alert.alert('Erro', 'Por favor, preencha pelo menos os gatilhos e sintomas.');
            return;
        }

        const now = new Date();
        const entry: CrisisEntry = {
            id: Date.now().toString(),
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().split(' ')[0].substring(0, 5),
            severity: newEntry.severity,
            triggers: newEntry.triggers,
            symptoms: newEntry.symptoms,
            copingStrategies: newEntry.copingStrategies,
            notes: newEntry.notes
        };

        setEntries([entry, ...entries]);
        setNewEntry({
            severity: 'medium',
            triggers: '',
            symptoms: '',
            copingStrategies: '',
            notes: ''
        });
        setIsAddingEntry(false);
    };

    const handleDeleteEntry = (id: string) => {
        Alert.alert(
            'Remover Entrada',
            'Tem certeza que deseja remover esta entrada do registro?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: () => {
                        setEntries(entries.filter(entry => entry.id !== id));
                    }
                }
            ]
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const renderEntry = ({ item }: { item: CrisisEntry }) => (
        <View style={styles.entryCard}>
            <View style={styles.entryHeader}>
                <View style={styles.entryDateInfo}>
                    <Text style={styles.entryDate}>{formatDate(item.date)}</Text>
                    <Text style={styles.entryTime}>{item.time}</Text>
                </View>
                <View style={[styles.severityBadge, { backgroundColor: severityColors[item.severity] }]}>
                    <Text style={styles.severityText}>{severityLabels[item.severity]}</Text>
                </View>
            </View>

            <View style={styles.entrySection}>
                <Text style={styles.sectionLabel}>Gatilhos:</Text>
                <Text style={styles.sectionText}>{item.triggers}</Text>
            </View>

            <View style={styles.entrySection}>
                <Text style={styles.sectionLabel}>Sintomas:</Text>
                <Text style={styles.sectionText}>{item.symptoms}</Text>
            </View>

            {item.copingStrategies && (
                <View style={styles.entrySection}>
                    <Text style={styles.sectionLabel}>Estratégias de Coping:</Text>
                    <Text style={styles.sectionText}>{item.copingStrategies}</Text>
                </View>
            )}

            {item.notes && (
                <View style={styles.entrySection}>
                    <Text style={styles.sectionLabel}>Notas:</Text>
                    <Text style={styles.sectionText}>{item.notes}</Text>
                </View>
            )}

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteEntry(item.id)}
            >
                <Ionicons name="trash-outline" size={16} color={Colors.light.iconAlert} />
                <Text style={styles.deleteButtonText}>Remover</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <ChevronLeft size={24} color={Colors.icon.gray} />
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Registro de crise</Text>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Seu Registro</Text>
                    <Text style={styles.sectionSubtitle}>
                        Acompanhe seus episódios de crise para identificar padrões
                    </Text>
                </View>

                {entries.length > 0 ? (
                    <FlatList
                        data={entries}
                        renderItem={renderEntry}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        style={styles.entriesList}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="document-text-outline" size={48} color={Colors.light.icon} />
                        <Text style={styles.emptyStateText}>Nenhum registro encontrado</Text>
                        <Text style={styles.emptyStateSubtext}>
                            Adicione entradas para acompanhar seus episódios de crise
                        </Text>
                    </View>
                )}

                {isAddingEntry && (
                    <View style={styles.addEntryForm}>
                        <Text style={styles.formTitle}>Adicionar Entrada</Text>

                        <View style={styles.severitySelector}>
                            <Text style={styles.inputLabel}>Severidade:</Text>
                            <View style={styles.severityButtons}>
                                {(['low', 'medium', 'high'] as const).map((severity) => (
                                    <TouchableOpacity
                                        key={severity}
                                        style={[
                                            styles.severityButton,
                                            newEntry.severity === severity && { backgroundColor: severityColors[severity] }
                                        ]}
                                        onPress={() => setNewEntry({ ...newEntry, severity })}
                                    >
                                        <Text style={[
                                            styles.severityButtonText,
                                            newEntry.severity === severity && { color: 'white' }
                                        ]}>
                                            {severityLabels[severity]}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Gatilhos (o que causou a crise?)"
                            value={newEntry.triggers}
                            onChangeText={(text) => setNewEntry({ ...newEntry, triggers: text })}
                            multiline
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Sintomas (como você se sentiu?)"
                            value={newEntry.symptoms}
                            onChangeText={(text) => setNewEntry({ ...newEntry, symptoms: text })}
                            multiline
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Estratégias de coping (o que ajudou?)"
                            value={newEntry.copingStrategies}
                            onChangeText={(text) => setNewEntry({ ...newEntry, copingStrategies: text })}
                            multiline
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Notas adicionais (opcional)"
                            value={newEntry.notes}
                            onChangeText={(text) => setNewEntry({ ...newEntry, notes: text })}
                            multiline
                        />

                        <View style={styles.formActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => {
                                    setIsAddingEntry(false);
                                    setNewEntry({
                                        severity: 'medium',
                                        triggers: '',
                                        symptoms: '',
                                        copingStrategies: '',
                                        notes: ''
                                    });
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleAddEntry}
                            >
                                <Text style={styles.saveButtonText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {!isAddingEntry && (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setIsAddingEntry(true)}
                    >
                        <Ionicons name="add" size={24} color="white" />
                        <Text style={styles.addButtonText}>Adicionar Entrada</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>Por que registrar crises?</Text>
                    <View style={styles.infoCard}>
                        <Ionicons name="analytics" size={20} color={Colors.light.tint} />
                        <Text style={styles.infoText}>
                            Identificar padrões nos seus gatilhos e sintomas
                        </Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Ionicons name="trending-up" size={20} color={Colors.light.tint} />
                        <Text style={styles.infoText}>
                            Acompanhar a eficácia das suas estratégias de coping
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    backButton: {
        paddingRight: 8,
        paddingVertical: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 16,
    },
    headerSpacer: {
        width: 32,
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 20,
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: Colors.light.icon,
        lineHeight: 20,
    },
    entriesList: {
        paddingHorizontal: 20,
    },
    entryCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    entryDateInfo: {
        flex: 1,
    },
    entryDate: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
    },
    entryTime: {
        fontSize: 14,
        color: Colors.light.icon,
    },
    severityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    severityText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    entrySection: {
        marginBottom: 12,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 4,
    },
    sectionText: {
        fontSize: 14,
        color: Colors.light.text,
        lineHeight: 20,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        padding: 8,
    },
    deleteButtonText: {
        fontSize: 12,
        color: Colors.light.iconAlert,
        marginLeft: 4,
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: Colors.light.icon,
        textAlign: 'center',
        lineHeight: 20,
    },
    addEntryForm: {
        backgroundColor: 'white',
        margin: 20,
        padding: 20,
        borderRadius: 12,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    formTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 16,
    },
    severitySelector: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.light.text,
        marginBottom: 8,
    },
    severityButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    severityButton: {
        flex: 1,
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.light.icon,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    severityButtonText: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.light.text,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.lightGray,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
        backgroundColor: 'white',
        minHeight: 80,
        textAlignVertical: 'top',
    },
    formActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    cancelButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.light.icon,
        marginRight: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: Colors.light.text,
        fontSize: 16,
        fontWeight: '500',
    },
    saveButton: {
        flex: 1,
        backgroundColor: Colors.light.tint,
        padding: 12,
        borderRadius: 8,
        marginLeft: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    addButton: {
        backgroundColor: Colors.light.tint,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        margin: 20,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    infoSection: {
        padding: 20,
        paddingTop: 10,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 12,
    },
    infoCard: {
        backgroundColor: Colors.lightGray,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    infoText: {
        fontSize: 14,
        color: Colors.light.text,
        marginLeft: 12,
        flex: 1,
        lineHeight: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
});

export default CrisisLogScreen;
