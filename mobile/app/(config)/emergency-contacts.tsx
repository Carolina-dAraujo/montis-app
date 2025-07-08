import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/mobile/constants/Colors';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface EmergencyContact {
    id: string;
    name: string;
    phone: string;
    relationship: string;
    isActive: boolean;
}

const EmergencyContactsScreen = () => {
    const [contacts, setContacts] = useState<EmergencyContact[]>([
        {
            id: '1',
            name: 'Maria Silva',
            phone: '+55 11 99999-9999',
            relationship: 'Mãe',
            isActive: true
        },
        {
            id: '2',
            name: 'João Santos',
            phone: '+55 11 88888-8888',
            relationship: 'Pai',
            isActive: true
        }
    ]);
    const [isAddingContact, setIsAddingContact] = useState(false);
    const [newContact, setNewContact] = useState({
        name: '',
        phone: '',
        relationship: ''
    });

    const handleAddContact = () => {
        if (!newContact.name || !newContact.phone || !newContact.relationship) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        const contact: EmergencyContact = {
            id: Date.now().toString(),
            name: newContact.name,
            phone: newContact.phone,
            relationship: newContact.relationship,
            isActive: true
        };

        setContacts([...contacts, contact]);
        setNewContact({ name: '', phone: '', relationship: '' });
        setIsAddingContact(false);
    };

    const handleDeleteContact = (id: string) => {
        Alert.alert(
            'Remover Contato',
            'Tem certeza que deseja remover este contato de emergência?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: () => {
                        setContacts(contacts.filter(contact => contact.id !== id));
                    }
                }
            ]
        );
    };

    const handleToggleContact = (id: string) => {
        setContacts(contacts.map(contact =>
            contact.id === id
                ? { ...contact, isActive: !contact.isActive }
                : contact
        ));
    };

    const renderContact = ({ item }: { item: EmergencyContact }) => (
        <View style={styles.contactCard}>
            <View style={styles.contactInfo}>
                <View style={styles.contactHeader}>
                    <Text style={styles.contactName}>{item.name}</Text>
                    <View style={[styles.statusIndicator, item.isActive && styles.statusActive]} />
                </View>
                <Text style={styles.contactPhone}>{item.phone}</Text>
                <Text style={styles.contactRelationship}>{item.relationship}</Text>
            </View>
            <View style={styles.contactActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleToggleContact(item.id)}
                >
                    <Ionicons
                        name={item.isActive ? "checkmark-circle" : "ellipse-outline"}
                        size={20}
                        color={item.isActive ? Colors.light.tint : Colors.light.icon}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteContact(item.id)}
                >
                    <Ionicons name="trash-outline" size={20} color={Colors.light.iconAlert} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Contatos de Emergência</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Seus Contatos</Text>
                    <Text style={styles.sectionSubtitle}>
                        Estes contatos receberão alertas quando você enviar um sinal de emergência.
                    </Text>
                </View>

                {contacts.length > 0 ? (
                    <FlatList
                        data={contacts}
                        renderItem={renderContact}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        style={styles.contactsList}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="people-outline" size={48} color={Colors.light.icon} />
                        <Text style={styles.emptyStateText}>Nenhum contato adicionado</Text>
                        <Text style={styles.emptyStateSubtext}>
                            Adicione contatos de emergência para receber alertas
                        </Text>
                    </View>
                )}

                {isAddingContact && (
                    <View style={styles.addContactForm}>
                        <Text style={styles.formTitle}>Adicionar Contato</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Nome completo"
                            value={newContact.name}
                            onChangeText={(text) => setNewContact({ ...newContact, name: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Telefone"
                            value={newContact.phone}
                            onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
                            keyboardType="phone-pad"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Relacionamento (ex: Mãe, Pai, Amigo)"
                            value={newContact.relationship}
                            onChangeText={(text) => setNewContact({ ...newContact, relationship: text })}
                        />

                        <View style={styles.formActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => {
                                    setIsAddingContact(false);
                                    setNewContact({ name: '', phone: '', relationship: '' });
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleAddContact}
                            >
                                <Text style={styles.saveButtonText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {!isAddingContact && (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setIsAddingContact(true)}
                    >
                        <Ionicons name="add" size={24} color="white" />
                        <Text style={styles.addButtonText}>Adicionar Contato</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>Informações Importantes</Text>
                    <View style={styles.infoCard}>
                        <Ionicons name="information-circle" size={20} color={Colors.light.tint} />
                        <Text style={styles.infoText}>
                            Os contatos ativos receberão notificações quando você enviar um alerta de emergência.
                        </Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Ionicons name="shield-checkmark" size={20} color={Colors.light.tint} />
                        <Text style={styles.infoText}>
                            Você pode ativar/desativar contatos individualmente usando o botão ao lado de cada um.
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
        padding: 20,
        paddingBottom: 10,
    },
    backButton: {
        padding: 4,
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
    contactsList: {
        paddingHorizontal: 20,
    },
    contactCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    contactInfo: {
        flex: 1,
    },
    contactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    contactName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        flex: 1,
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.light.icon,
    },
    statusActive: {
        backgroundColor: Colors.light.tint,
    },
    contactPhone: {
        fontSize: 14,
        color: Colors.light.text,
        marginBottom: 2,
    },
    contactRelationship: {
        fontSize: 12,
        color: Colors.light.icon,
    },
    contactActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: 8,
        marginLeft: 8,
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
    addContactForm: {
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
    input: {
        borderWidth: 1,
        borderColor: Colors.lightGray,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
        backgroundColor: 'white',
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
});

export default EmergencyContactsScreen;
