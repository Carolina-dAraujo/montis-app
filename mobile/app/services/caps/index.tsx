import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    TextInput,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/mobile/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ChevronLeft } from '@/mobile/components/icons/ChevronLeft';

interface CAPSService {
    id: string;
    name: string;
    address: string;
    phone: string;
    schedule: string;
    type: 'online' | 'in-person' | 'hybrid';
    distance: string;
    specialties: string[];
}

const capsServices: CAPSService[] = [
    {
        id: '1',
        name: 'CAPS AD III Liberdade',
        address: 'Rua das Flores, 123 - Centro',
        phone: '(11) 9999-8888',
        schedule: 'Segunda a Sexta - 8:00 às 18:00',
        type: 'in-person',
        distance: '0.5 km',
        specialties: ['Alcoolismo', 'Dependência Química', 'Saúde Mental'],
    },
    {
        id: '2',
        name: 'CAPS II Saúde Mental',
        address: 'Av. Paulista, 456 - Bela Vista',
        phone: '(11) 8888-7777',
        schedule: 'Segunda a Sexta - 8:00 às 17:00',
        type: 'hybrid',
        distance: '1.2 km',
        specialties: ['Depressão', 'Ansiedade', 'Transtornos Psicóticos'],
    },
    {
        id: '3',
        name: 'CAPS Infantil',
        address: 'Rua Augusta, 789 - Consolação',
        phone: '(11) 7777-6666',
        schedule: 'Segunda a Sexta - 8:00 às 18:00',
        type: 'in-person',
        distance: '2.1 km',
        specialties: ['Saúde Mental Infantil', 'Transtornos do Desenvolvimento'],
    },
];

export default function CAPSServicesScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const filteredServices = capsServices.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.address.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'online':
                return 'monitor';
            case 'in-person':
                return 'hospital-building';
            case 'hybrid':
                return 'monitor-account';
            default:
                return 'help-circle';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'online':
                return '#007AFF';
            case 'in-person':
                return '#34C759';
            case 'hybrid':
                return '#FF9500';
            default:
                return Colors.icon.gray;
        }
    };

    const getTypeText = (type: string) => {
        switch (type) {
            case 'online':
                return 'Online';
            case 'in-person':
                return 'Presencial';
            case 'hybrid':
                return 'Híbrido';
            default:
                return 'Desconhecido';
        }
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <ChevronLeft onPress={() => router.back()} />
                    <View style={styles.titleContainer}>
                        <Image
                            source={require('@/mobile/assets/images/caps.png')}
                            style={styles.serviceIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.title} numberOfLines={2}>
                            Centro de Atenção Psicossocial (CAPS)
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <MaterialCommunityIcons name="magnify" size={20} color={Colors.icon.gray} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar centros..."
                        placeholderTextColor={Colors.icon.gray}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>



            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {filteredServices.map((service) => (
                    <TouchableOpacity key={service.id} style={styles.serviceCard}>
                        <View style={styles.serviceHeader}>
                            <Text style={styles.serviceName}>{service.name}</Text>
                            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(service.type) }]}>
                                <MaterialCommunityIcons
                                    name={getTypeIcon(service.type) as any}
                                    size={12}
                                    color="#FFFFFF"
                                />
                                <Text style={styles.typeText}>{getTypeText(service.type)}</Text>
                            </View>
                        </View>

                        <View style={styles.serviceInfo}>
                            <View style={styles.infoRow}>
                                <MaterialCommunityIcons name="map-marker" size={16} color={Colors.icon.gray} />
                                <Text style={styles.infoText}>{service.address}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <MaterialCommunityIcons name="phone" size={16} color={Colors.icon.gray} />
                                <Text style={styles.infoText}>{service.phone}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <MaterialCommunityIcons name="clock" size={16} color={Colors.icon.gray} />
                                <Text style={styles.infoText}>{service.schedule}</Text>
                            </View>

                            {service.distance && (
                                <View style={styles.infoRow}>
                                    <MaterialCommunityIcons name="map-marker-distance" size={16} color={Colors.icon.gray} />
                                    <Text style={styles.infoText}>{service.distance}</Text>
                                </View>
                            )}

                            {service.specialties && (
                                <View style={styles.specialtiesContainer}>
                                    <Text style={styles.specialtiesTitle}>Especialidades:</Text>
                                    <View style={styles.specialtiesList}>
                                        {service.specialties.map((specialty, index) => (
                                            <View key={index} style={styles.specialtyBadge}>
                                                <Text style={styles.specialtyText}>{specialty}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity style={styles.contactButton}>
                            <Text style={styles.contactButtonText}>Entrar em contato</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        paddingBottom: 16,
        paddingRight: 20,
        width: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        width: '100%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        flex: 1,
        flexWrap: 'wrap',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    serviceIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: Colors.input,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: Colors.light.text,
    },

    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    serviceCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    serviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
        flex: 1,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    typeText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    serviceInfo: {
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: Colors.light.text,
        marginLeft: 8,
    },
    specialtiesContainer: {
        marginTop: 8,
    },
    specialtiesTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 8,
    },
    specialtiesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    specialtyBadge: {
        backgroundColor: Colors.containers.blue,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    specialtyText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    contactButton: {
        backgroundColor: Colors.containers.blue,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    contactButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
