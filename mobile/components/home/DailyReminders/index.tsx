import { View, Text, Pressable } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Colors } from '@/mobile/constants/Colors';
import { styles } from './styles';

type Reminder = {
    id: string;
    title: string;
    time: string;
    type: 'meeting' | 'check-in';
    isOnline?: boolean;
    meetingLink?: string;
    onPress: () => void;
};

// TODO: Replace with actual data from user's calendar/meetings and daily check status
const todayReminders: Reminder[] = [
    {
        id: 'aa-meeting',
        title: 'Reunião AA - Grupo Esperança',
        time: '19:00',
        type: 'meeting',
        isOnline: true,
        meetingLink: 'https://meet.google.com/xxx-yyyy-zzz',
        onPress: () => {
            // TODO: Open meeting link or navigate to meeting details
        },
    },
];

// TODO: Replace with actual check from user's data
const isDailyCheckCompleted = false;

export function DailyReminders() {
    const hasMeetings = todayReminders.some(reminder => reminder.type === 'meeting');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Hoje</Text>
                <Text style={styles.subtitle}>Lembretes e compromissos</Text>
            </View>

            <View style={styles.remindersContainer}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Reuniões</Text>
                    {hasMeetings ? (
                        todayReminders
                            .filter(reminder => reminder.type === 'meeting')
                            .map((reminder) => (
                                <Pressable
                                    key={reminder.id}
                                    style={styles.reminderButton}
                                    onPress={reminder.onPress}
                                >
                                    <View style={styles.iconContainer}>
                                        <FontAwesome6
                                            name={reminder.isOnline ? 'video' : 'users'} 
                                            size={24}
                                            color={Colors.containers.blue}
                                        />
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.reminderTitle}>{reminder.title}</Text>
                                        <Text style={styles.reminderTime}>{reminder.time}</Text>
                                        {reminder.isOnline && (
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
