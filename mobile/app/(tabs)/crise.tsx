import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/mobile/constants/Colors';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const CrisisScreen = () => {
    const [isAlertActive, setIsAlertActive] = useState(false);

    const handleEmergencyAlert = () => {
        Alert.alert(
            "Alerta de Emergência",
            "Tem certeza que deseja enviar um alerta para seus contatos de emergência?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Enviar",
                    style: "destructive",
                    onPress: () => {
                        setIsAlertActive(true);
                        // TODO: Implement actual emergency alert
                        setTimeout(() => setIsAlertActive(false), 3000);
                    }
                }
            ]
        );
    };

    const handleCallEmergency = (number: string, service: string) => {
        Alert.alert(
            `Ligar para ${service}`,
            `Deseja ligar para ${service} (${number})?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Ligar",
                    onPress: () => Linking.openURL(`tel:${number}`)
                }
            ]
        );
    };

    const handleManageContacts = () => {
        router.push('/(config)/emergency-contacts');
    };

    const handleCopingTools = () => {
        router.push('/(config)/coping-tools');
    };

    const handleCrisisLog = () => {
        router.push('/(config)/crisis-log');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Crise</Text>
                    <Text style={styles.subtitle}>Acesso rápido a recursos de emergência</Text>
                </View>

                {/* Emergency Alert Card */}
                <View style={styles.section}>
                    <View style={styles.emergencyCard}>
                        <TouchableOpacity
                            style={[styles.emergencyButton, isAlertActive && styles.emergencyButtonActive]}
                            onPress={handleEmergencyAlert}
                            disabled={isAlertActive}
                        >
                            <Ionicons
                                name="warning"
                                size={24}
                                color="white"
                            />
                            <Text style={styles.emergencyButtonText}>
                                {isAlertActive ? "Alerta Enviado" : "Enviar Alerta de Emergência"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Emergency Services Card */}
                <View style={styles.section}>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Serviços de Emergência</Text>
                        <View style={styles.servicesContainer}>
                            <TouchableOpacity
                                style={styles.serviceCard}
                                onPress={() => handleCallEmergency('190', 'Polícia')}
                            >
                                <Ionicons name="shield" size={20} color={Colors.containers.blue} />
                                <Text style={styles.serviceText}>Polícia</Text>
                                <Text style={styles.serviceNumber}>190</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.serviceCard}
                                onPress={() => handleCallEmergency('192', 'Ambulância')}
                            >
                                <Ionicons name="medical" size={20} color={Colors.containers.blue} />
                                <Text style={styles.serviceText}>Ambulância</Text>
                                <Text style={styles.serviceNumber}>192</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.serviceCard}
                                onPress={() => handleCallEmergency('193', 'Bombeiros')}
                            >
                                <Ionicons name="flame" size={20} color={Colors.containers.blue} />
                                <Text style={styles.serviceText}>Bombeiros</Text>
                                <Text style={styles.serviceNumber}>193</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.serviceCard}
                                onPress={() => handleCallEmergency('188', 'CVV')}
                            >
                                <Ionicons name="heart" size={20} color={Colors.containers.blue} />
                                <Text style={styles.serviceText}>CVV</Text>
                                <Text style={styles.serviceNumber}>188</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Quick Actions Card */}
                <View style={styles.section}>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Ações Rápidas</Text>

                        <TouchableOpacity style={styles.actionCard} onPress={handleCopingTools}>
                            <Ionicons name="leaf" size={20} color={Colors.light.text} />
                            <Text style={styles.actionText}>Ferramentas de Coping</Text>
                            <Ionicons name="chevron-forward" size={16} color={Colors.light.icon} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionCard} onPress={handleManageContacts}>
                            <Ionicons name="people" size={20} color={Colors.light.text} />
                            <Text style={styles.actionText}>Contatos de Emergência</Text>
                            <Ionicons name="chevron-forward" size={16} color={Colors.light.icon} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionCard} onPress={handleCrisisLog}>
                            <Ionicons name="document-text" size={20} color={Colors.light.text} />
                            <Text style={styles.actionText}>Registro de Crise</Text>
                            <Ionicons name="chevron-forward" size={16} color={Colors.light.icon} />
                        </TouchableOpacity>
                    </View>
                </View>



                {/* Important Information Card */}
                <View style={styles.section}>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Informações Importantes</Text>

                        <View style={styles.infoCard}>
                            <Ionicons name="information-circle" size={20} color={Colors.containers.blue} />
                            <Text style={styles.infoText}>
                                Se você está em perigo imediato, ligue para 190 (Polícia) ou 192 (Ambulância).
                            </Text>
                        </View>

                        <View style={styles.infoCard}>
                            <Ionicons name="heart" size={20} color={Colors.containers.blue} />
                            <Text style={styles.infoText}>
                                Você não está sozinho. Há pessoas que se importam e querem ajudar.
                            </Text>
                        </View>
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
    scrollView: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.icon.gray,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    card: {
        backgroundColor: Colors.light.background,
        borderRadius: 16,
        padding: 20,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 16,
    },
    emergencyCard: {
        backgroundColor: Colors.light.background,
        borderRadius: 16,
        padding: 20,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    emergencyButton: {
        backgroundColor: Colors.light.iconAlert,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emergencyButtonActive: {
        backgroundColor: '#34C759',
    },
    emergencyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    servicesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    serviceCard: {
        width: '48%',
        backgroundColor: Colors.lightGray,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    serviceText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.light.text,
        marginTop: 8,
        marginBottom: 4,
    },
    serviceNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.containers.blue,
    },
    actionCard: {
        backgroundColor: Colors.lightGray,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        fontSize: 16,
        color: Colors.light.text,
        marginLeft: 12,
        flex: 1,
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
});

export default CrisisScreen;
