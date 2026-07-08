import React, { useState } from 'react';
import { 
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Image,
    Linking,
 } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/shared/theme/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ChevronLeft } from 'lucide-react-native';
import { styles } from '@/features/services/styles/caps.styles';
import type { MaterialCommunityIconName } from '@/shared/types/icons';

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

export default function Caps() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const filteredServices = capsServices.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.address.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const getTypeIcon = (type: string): MaterialCommunityIconName => {
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

    const handleCall = (phoneNumber: string) => {
        const url = `tel:${phoneNumber.replace(/\D/g, '')}`;
        Linking.openURL(url).catch(err => {
            console.error('Erro ao tentar abrir o discador:', err);
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    				<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
					<ChevronLeft size={24} color={Colors.icon.gray} />
				</TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Image
                            source={require('@/assets/images/caps.png')}
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
                                    name={getTypeIcon(service.type)}
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

                        <TouchableOpacity style={styles.contactButton} onPress={() => handleCall(service.phone)}>
                            <Text style={styles.contactButtonText}>Entrar em contato</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
