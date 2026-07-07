import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/shared/theme/colors';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { IoniconName } from '@/shared/types/icons';
import { ConfigHeader } from '@/features/settings/components/ConfigHeader';
import { styles } from '@/features/crisisSupport/styles/crisisResources.styles';

export default function CrisisResources() {
    const router = useRouter();
    const emergencyNumbers: {
        name: string;
        number: string;
        description: string;
        icon: IoniconName;
    }[] = [
        {
            name: 'Centro de Valorização da Vida (CVV)',
            number: '188',
            description: 'Suporte emocional e prevenção do suicídio',
            icon: 'heart'
        },
        {
            name: 'Polícia',
            number: '190',
            description: 'Emergências policiais',
            icon: 'shield'
        },
        {
            name: 'Ambulância',
            number: '192',
            description: 'Emergências médicas',
            icon: 'medical'
        },
        {
            name: 'Bombeiros',
            number: '193',
            description: 'Emergências de incêndio e resgate',
            icon: 'flame'
        }
    ];

    const copingStrategies: {
        title: string;
        description: string;
        icon: IoniconName;
    }[] = [
        {
            title: 'Respiração 4-7-8',
            description: 'Inspire por 4 segundos, segure por 7, expire por 8',
            icon: 'leaf'
        },
        {
            title: 'Técnica 5-4-3-2-1',
            description: 'Identifique 5 coisas que você vê, 4 que pode tocar, 3 que pode ouvir, 2 que pode cheirar, 1 que pode saborear',
            icon: 'eye'
        },
        {
            title: 'Progressive Muscle Relaxation',
            description: 'Tense e relaxe grupos musculares progressivamente',
            icon: 'body'
        },
        {
            title: 'Mindfulness',
            description: 'Foque no momento presente, observe seus pensamentos sem julgá-los',
            icon: 'sunny'
        }
    ];

    const helpfulLinks = [
        {
            title: 'Associação Brasileira de Psiquiatria',
            url: 'https://www.abp.org.br',
            description: 'Informações sobre saúde mental'
        },
        {
            title: 'Ministério da Saúde - Saúde Mental',
            url: 'https://www.gov.br/saude/pt-br/assuntos/saude-mental',
            description: 'Recursos oficiais de saúde mental'
        },
        {
            title: 'CVV - Centro de Valorização da Vida',
            url: 'https://www.cvv.org.br',
            description: 'Suporte emocional 24 horas'
        }
    ];

    const handleCallNumber = (number: string, name: string) => {
        Alert.alert(
            `Ligar para ${name}`,
            `Deseja ligar para ${name} (${number})?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Ligar',
                    onPress: () => {
                        Linking.openURL(`tel:${number}`);
                    }
                }
            ]
        );
    };

    const handleOpenLink = (url: string, title: string) => {
        Alert.alert(
            'Abrir Link',
            `Deseja abrir ${title} no navegador?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Abrir',
                    onPress: () => {
                        Linking.openURL(url);
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ConfigHeader
                title="Recursos de Crise"
                onBack={() => router.back()}
                backIcon="arrow"
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Emergency Numbers */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Números de Emergência</Text>
                    <Text style={styles.sectionSubtitle}>
                        Ligue para estes números se precisar de ajuda imediata
                    </Text>

                    {emergencyNumbers.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.emergencyCard}
                            onPress={() => handleCallNumber(item.number, item.name)}
                        >
                            <View style={styles.emergencyCardContent}>
                                <View style={styles.emergencyIconContainer}>
                                    <Ionicons name={item.icon} size={24} color={Colors.light.tint} />
                                </View>
                                <View style={styles.emergencyInfo}>
                                    <Text style={styles.emergencyName}>{item.name}</Text>
                                    <Text style={styles.emergencyNumber}>{item.number}</Text>
                                    <Text style={styles.emergencyDescription}>{item.description}</Text>
                                </View>
                                <Ionicons name="call" size={20} color={Colors.light.tint} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Coping Strategies */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Estratégias de Coping</Text>
                    <Text style={styles.sectionSubtitle}>
                        Técnicas para ajudar você a lidar com momentos difíceis
                    </Text>

                    {copingStrategies.map((strategy, index) => (
                        <View key={index} style={styles.copingCard}>
                            <View style={styles.copingCardContent}>
                                <View style={styles.copingIconContainer}>
                                    <Ionicons name={strategy.icon} size={20} color={Colors.light.tint} />
                                </View>
                                <View style={styles.copingInfo}>
                                    <Text style={styles.copingTitle}>{strategy.title}</Text>
                                    <Text style={styles.copingDescription}>{strategy.description}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Helpful Links */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Links Úteis</Text>
                    <Text style={styles.sectionSubtitle}>
                        Recursos online para mais informações e apoio
                    </Text>

                    {helpfulLinks.map((link, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.linkCard}
                            onPress={() => handleOpenLink(link.url, link.title)}
                        >
                            <View style={styles.linkCardContent}>
                                <View style={styles.linkInfo}>
                                    <Text style={styles.linkTitle}>{link.title}</Text>
                                    <Text style={styles.linkDescription}>{link.description}</Text>
                                </View>
                                <Ionicons name="open-outline" size={20} color={Colors.light.tint} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Important Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informações Importantes</Text>
                    <View style={styles.infoCard}>
                        <Ionicons name="information-circle" size={20} color={Colors.light.tint} />
                        <Text style={styles.infoText}>
                            Se você está pensando em se machucar, ligue para o CVV (188) imediatamente.
                        </Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Ionicons name="shield-checkmark" size={20} color={Colors.light.tint} />
                        <Text style={styles.infoText}>
                            Estes recursos são para apoio e informação. Em emergências médicas, sempre ligue para 192.
                        </Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Ionicons name="heart" size={20} color={Colors.light.tint} />
                        <Text style={styles.infoText}>
                            Você não está sozinho. Há pessoas que se importam e querem ajudar.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
