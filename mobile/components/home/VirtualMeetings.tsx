import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/mobile/constants/Colors';
import { Linking } from 'react-native';

interface VirtualMeeting {
    id: string;
    name: string;
    city: string;
    schedule: string;
    platform: 'Zoom' | 'Zello' | 'Google Meet';
    link: string;
    password?: string;
    description?: string;
    isOpenToVisitors: boolean;
    nextMeeting?: string;
}

export const VirtualMeetings: React.FC = () => {
    const [meetings, setMeetings] = useState<VirtualMeeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'now' | 'today'>('all');

    useEffect(() => {
        loadMeetings();
    }, []);

    const loadMeetings = async () => {
        try {
            setLoading(true);
            const aaGroupsData = await import('@/mobile/data/aa-groups.json');

            // Transform the data to include next meeting time and visitor status
            const transformedMeetings = aaGroupsData.groups.map(group => ({
                id: group.id,
                name: group.name,
                city: group.city,
                schedule: group.schedule,
                platform: group.platform as 'Zoom' | 'Zello' | 'Google Meet',
                link: group.link,
                password: group.password,
                description: group.description,
                isOpenToVisitors: group.schedule.includes('Aberta para visitantes'),
                nextMeeting: getNextMeetingTime(group.schedule),
            }));

            setMeetings(transformedMeetings);
        } catch (error) {
            console.error('Error loading meetings:', error);
        } finally {
            setLoading(false);
        }
    };

    const getNextMeetingTime = (schedule: string): string => {
        // Simple logic to determine next meeting
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // For now, just return a placeholder
        return 'Próxima reunião em breve';
    };

    const getFilteredMeetings = () => {
        switch (selectedFilter) {
            case 'now':
                return meetings.filter(meeting =>
                    meeting.isOpenToVisitors &&
                    meeting.schedule.includes('19:00') ||
                    meeting.schedule.includes('20:00')
                );
            case 'today':
                return meetings.filter(meeting =>
                    meeting.isOpenToVisitors
                );
            default:
                return meetings;
        }
    };

    const handleMeetingPress = (meeting: VirtualMeeting) => {
        const details = [
            meeting.description || '',
            '',
            `📍 ${meeting.city}`,
            `🕒 ${meeting.schedule}`,
            `💻 ${meeting.platform}`,
            ...(meeting.password ? [`🔑 Senha: ${meeting.password}`] : []),
            ...(meeting.isOpenToVisitors ? ['✅ Aberta para visitantes'] : ['🔒 Reunião fechada']),
        ].filter(Boolean).join('\n');

        Alert.alert(
            meeting.name,
            details,
            [
                { text: 'Fechar', style: 'cancel' },
                {
                    text: 'Entrar na Reunião',
                    onPress: () => {
                        if (meeting.link) {
                            Linking.openURL(meeting.link);
                        }
                    }
                },
            ]
        );
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'Zoom':
                return 'videocam';
            case 'Zello':
                return 'people';
            case 'Google Meet':
                return 'videocam-outline';
            default:
                return 'people';
        }
    };

    const getPlatformColor = (platform: string) => {
        switch (platform) {
            case 'Zoom':
                return '#2D8CFF';
            case 'Zello':
                return '#34C759';
            case 'Google Meet':
                return '#EA4335';
            default:
                return Colors.containers.blue;
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Reuniões Virtuais</Text>
                    <View style={styles.loadingContainer}>
                        <Ionicons name="videocam" size={32} color={Colors.containers.blue} />
                        <Text style={styles.loadingText}>Carregando reuniões...</Text>
                    </View>
                </View>
            </View>
        );
    }

    const filteredMeetings = getFilteredMeetings();

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Reuniões Virtuais</Text>
                    <View style={styles.filterContainer}>
                        <TouchableOpacity
                            style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
                            onPress={() => setSelectedFilter('all')}
                        >
                            <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>Todas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.filterButton, selectedFilter === 'now' && styles.filterButtonActive]}
                            onPress={() => setSelectedFilter('now')}
                        >
                            <Text style={[styles.filterText, selectedFilter === 'now' && styles.filterTextActive]}>Agora</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.filterButton, selectedFilter === 'today' && styles.filterButtonActive]}
                            onPress={() => setSelectedFilter('today')}
                        >
                            <Text style={[styles.filterText, selectedFilter === 'today' && styles.filterTextActive]}>Hoje</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.meetingsContainer}
                >
                    {filteredMeetings.slice(0, 8).map((meeting) => (
                        <TouchableOpacity
                            key={meeting.id}
                            style={styles.meetingCard}
                            onPress={() => handleMeetingPress(meeting)}
                        >
                            <View style={[styles.platformIcon, { backgroundColor: getPlatformColor(meeting.platform) }]}>
                                <Ionicons
                                    name={getPlatformIcon(meeting.platform) as any}
                                    size={20}
                                    color="white"
                                />
                            </View>
                            <Text style={styles.meetingName} numberOfLines={2}>
                                {meeting.name}
                            </Text>
                            <Text style={styles.meetingCity}>
                                {meeting.city}
                            </Text>
                            <Text style={styles.meetingSchedule} numberOfLines={1}>
                                {meeting.schedule.split(',')[0]}
                            </Text>
                            {meeting.isOpenToVisitors && (
                                <View style={styles.visitorBadge}>
                                    <Text style={styles.visitorText}>Visitantes</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 16,
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
    cardHeader: {
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 12,
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: Colors.lightGray,
    },
    filterButtonActive: {
        backgroundColor: Colors.containers.blue,
    },
    filterText: {
        fontSize: 12,
        color: Colors.icon.gray,
        fontWeight: '500',
    },
    filterTextActive: {
        color: 'white',
    },
    meetingsContainer: {
        paddingRight: 20,
    },
    meetingCard: {
        width: 160,
        backgroundColor: Colors.lightGray,
        borderRadius: 12,
        padding: 16,
        marginRight: 12,
        alignItems: 'center',
    },
    platformIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    meetingName: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
        textAlign: 'center',
        marginBottom: 4,
    },
    meetingCity: {
        fontSize: 12,
        color: Colors.containers.blue,
        fontWeight: '500',
        marginBottom: 4,
    },
    meetingSchedule: {
        fontSize: 10,
        color: Colors.icon.gray,
        textAlign: 'center',
        marginBottom: 6,
    },
    visitorBadge: {
        backgroundColor: Colors.light.iconAlert,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    visitorText: {
        fontSize: 8,
        color: 'white',
        fontWeight: '600',
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        fontSize: 14,
        color: Colors.icon.gray,
        marginTop: 8,
    },
});
