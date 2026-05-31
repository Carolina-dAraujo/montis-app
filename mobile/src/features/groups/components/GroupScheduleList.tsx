import { View, Text, Switch } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '@/shared/theme/colors';
import { AAGroup } from '@/features/groups/hooks/useUserGroups';
import { WEEK_DAYS } from '@/features/groups/constants/weekDays';
import { styles } from '@/features/groups/styles/groupDetail.styles';

type GroupScheduleListProps = {
	group: AAGroup;
	onMeetingNotificationToggle: (
		groupId: string,
		day: string,
		meetingIndex: number,
		enabled: boolean
	) => void;
};

export function GroupScheduleList({ group, onMeetingNotificationToggle }: GroupScheduleListProps) {
	return (
		<View style={styles.schedulesSection}>
			<Text style={styles.sectionTitle}>Horários Semanais</Text>
			<View style={styles.schedulesList}>
				{WEEK_DAYS.map((day) => {
					const schedule = group.schedule[day.key];
					if (!schedule) {
						return null;
					}

					return (
						<View key={day.key} style={styles.scheduleItem}>
							<View style={styles.scheduleInfo}>
								<View style={styles.scheduleHeader}>
									<MaterialCommunityIcons
										name="calendar-week"
										size={16}
										color={Colors.containers.blue}
									/>
									<Text style={styles.scheduleDay}>{day.label}</Text>
								</View>
								<View style={styles.meetingTimesList}>
									{schedule.map((meeting, index) => (
										<View key={`${day.key}-${index}`} style={styles.meetingTimeItem}>
											<Text style={styles.meetingTimeText}>
												{meeting.start} - {meeting.end}
											</Text>
											<Switch
												value={!!meeting.notificationsEnabled}
												onValueChange={(enabled) =>
													onMeetingNotificationToggle(group.id, day.key, index, enabled)
												}
												trackColor={{ false: '#E9ECEF', true: Colors.containers.blue }}
												thumbColor="#FFFFFF"
											/>
										</View>
									))}
								</View>
							</View>
						</View>
					);
				})}
			</View>
		</View>
	);
}
