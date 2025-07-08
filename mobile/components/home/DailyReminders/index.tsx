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
    
    // TODO: Replace with actual check from user's daily check-in data
    const isDailyCheckCompleted = false;
    
    // Check if user has enabled daily reminders
    const hasDailyReminders = onboardingData?.dailyReminders ?? false;

    // Find today's meetings from all groups
    const todayKey = getTodayWeekdayKey();
    const todayMeetings = groups.flatMap(group =>
        (group.meetingSchedules || [])
            .filter(sch => sch.day === todayKey && sch.enabled)
            .map(sch => ({
                groupId: group.groupId,
                groupName: group.groupName,
                time: sch.time,
                type: group.type,
                isOnline: group.type === 'online',
            }))
    );

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
                                style={styles.reminderButton}
                                onPress={() => router.push(`/group-detail/${meeting.groupId}`)}
                            >
                                <View style={styles.iconContainer}>
                                    <FontAwesome6
                                        name={meeting.type === 'online' ? 'video' : meeting.type === 'in-person' ? 'users' : 'monitor'}
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
                            style={[
                                styles.reminderButton,
                                isDailyCheckCompleted ? styles.checkInButtonCompleted : styles.checkInButton
                            ]}
                            onPress={() => {
                                // TODO: Navigate to daily check-in form or view
                            }}
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
                                    Registro Diário
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
