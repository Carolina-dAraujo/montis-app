import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Colors } from '@/mobile/constants/Colors';
import { useUserGroups } from '@/mobile/hooks/useUserGroups';
import { MeetingSkeleton } from './MeetingSkeleton';
import { apiService } from '@/mobile/services/api';
import { storageService } from '@/mobile/services/storage';
import { styles } from './styles';

function getTodayWeekdayKey(): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
}

export function DailyReminders() {
    const { groups, loading } = useUserGroups();
    const [isDailyCheckCompleted, setIsDailyCheckCompleted] = useState(false);
    const [checkingCompletion, setCheckingCompletion] = useState(true);

    const checkTodayCompletion = async () => {
        try {
            const token = await storageService.getAuthToken();
            if (!token) return;

            const today = new Date().toISOString().slice(0, 10);

            try {
                const trackingData = await apiService.getDailyTracking(token, today);
                const isCompleted = Object.keys(trackingData).length > 0;

                setIsDailyCheckCompleted(isCompleted);
            } catch (error) {
                setIsDailyCheckCompleted(false);
            }
        } catch (error) {
            console.error('Error checking daily completion:', error);
        } finally {
            setCheckingCompletion(false);
        }
    };

    useEffect(() => {
        checkTodayCompletion();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            checkTodayCompletion();
        }, [])
    );

    const todayKey = getTodayWeekdayKey();
    const todayMeetings = groups.flatMap(group => {
        if (!group.schedule || !group.schedule[todayKey]) {
            return [];
        }

        return group.schedule[todayKey]
            .filter(meeting => meeting.notificationsEnabled === true)
            .map(meeting => ({
                groupId: group.id,
                groupName: group.name,
                time: `${meeting.start} - ${meeting.end}`,
                type: group.type,
                isOnline: group.type === 'virtual',
                notificationsEnabled: meeting.notificationsEnabled === true,
            }));
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Hoje</Text>
                <Text style={styles.subtitle}>Lembretes e compromissos</Text>
            </View>

            <View style={styles.remindersContainer}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Reuniões</Text>
                    {loading ? (
                        <MeetingSkeleton count={2} />
                    ) : todayMeetings.length > 0 ? (
                        todayMeetings.map((meeting, idx) => (
                            <Pressable
                                key={meeting.groupId + meeting.time + idx}
                                style={({ pressed }) => [
                                    styles.reminderButton,
                                    pressed && {
                                        opacity: 0.8,
                                        shadowOpacity: 0.1,
                                        elevation: 3,
                                    }
                                ]}
                                onPress={() => router.push(`/group-detail/${meeting.groupId}`)}
                                android_ripple={{ color: Colors.containers.blueLight, borderless: false }}
                            >
                                <View style={styles.iconContainer}>
                                    <FontAwesome6
                                        name={meeting.type === 'virtual' ? 'video' : meeting.type === 'in-person' ? 'users' : 'monitor'}
                                        size={24}
                                        color={Colors.containers.blue}
                                    />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.reminderTitle}>{meeting.groupName}</Text>
                                    <Text style={styles.reminderTime}>{meeting.time}</Text>
                                    {meeting.isOnline && (
                                        <Text style={styles.onlineTag}>Online</Text>
                                    )}
                                </View>
                            </Pressable>
                        ))
                    ) : (
                        <Pressable
                            style={styles.emptyStateContainer}
                            onPress={() => router.push('/(tabs)/grupos')}
                            android_ripple={{ color: Colors.containers.blueLight, borderless: false }}
                        >
                            <FontAwesome6
                                name="calendar-xmark"
                                size={24}
                                color={Colors.light.text}
                                style={styles.emptyStateIcon}
                            />
                            <Text style={styles.emptyStateText}>Nenhuma reunião agendada para hoje</Text>
                            <Text style={styles.emptyStateAction}>Toque para encontrar reuniões</Text>
                        </Pressable>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Agenda</Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.reminderButton,
                            isDailyCheckCompleted ? styles.checkInButtonCompleted : styles.checkInButton,
                            pressed && {
                                opacity: 0.8,
                                shadowOpacity: 0.1,
                                elevation: 3,
                            }
                        ]}
                        onPress={() => {
                            router.push({ pathname: '/tracking/[date]', params: { date: new Date().toISOString() } });
                        }}
                        android_ripple={{ color: 'rgba(255, 255, 255, 0.2)', borderless: false }}
                    >
                        <View style={[
                            styles.iconContainer,
                            isDailyCheckCompleted ? styles.checkInIconCompleted : styles.checkInIcon
                        ]}>
                            <FontAwesome6
                                name={isDailyCheckCompleted ? "check" : "note-sticky"}
                                size={24}
                                color={isDailyCheckCompleted ? Colors.containers.blue : Colors.light.background}
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[
                                styles.reminderTitle,
                                isDailyCheckCompleted ? styles.checkInTitleCompleted : styles.checkInTitle
                            ]}>
                                Registro diário
                            </Text>
                            <Text style={[
                                styles.reminderTime,
                                isDailyCheckCompleted ? styles.checkInTimeCompleted : styles.checkInTime
                            ]}>
                                {isDailyCheckCompleted ? 'Completo' : 'Pendente'}
                            </Text>
                        </View>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
