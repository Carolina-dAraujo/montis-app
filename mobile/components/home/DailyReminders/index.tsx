import { View, Text, Pressable } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Colors } from '@/mobile/constants/Colors';
import { styles } from './styles';
import { useOnboarding } from '@/mobile/contexts/OnboardingContext';
import { useUserGroups } from '@/mobile/hooks/useUserGroups';
import { useRouter } from 'expo-router';

function getTodayWeekdayKey(): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
}

export function DailyReminders() {
    const { onboardingData } = useOnboarding();
    const { groups, loading } = useUserGroups();
    const router = useRouter();

    const isDailyCheckCompleted = false;
    const hasDailyReminders = onboardingData?.dailyReminders ?? false;

    const todayKey = getTodayWeekdayKey();
    const todayMeetings = groups.flatMap(group => {
        if (!group.schedule || !group.schedule[todayKey]) {
            return [];
        }

        return group.schedule[todayKey]
            .filter(meeting => meeting.notificationsEnabled !== false)
            .map(meeting => ({
                groupId: group.id,
                groupName: group.name,
                time: `${meeting.start} - ${meeting.end}`,
                type: group.type,
                isOnline: group.type === 'virtual',
                notificationsEnabled: meeting.notificationsEnabled !== false,
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
                    {loading ? null : todayMeetings.length > 0 ? (
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
                        <View style={styles.emptyStateContainer}>
                            <FontAwesome6
                                name="calendar-xmark"
                                size={24}
                                color={Colors.light.text}
                                style={styles.emptyStateIcon}
                            />
                            <Text style={styles.emptyStateText}>Nenhuma reunião agendada para hoje</Text>
                        </View>
                    )}
                </View>

                {hasDailyReminders && (
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
                                // TODO: Navigate to daily check-in form or view
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
                                <Text style={styles.reminderTime}>
                                    {isDailyCheckCompleted ? 'Completo' : 'Pendente'}
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                )}
            </View>
        </View>
    );
}
