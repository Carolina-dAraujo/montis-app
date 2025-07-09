import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeHeader } from '@/mobile/components/home/HomeHeader';
import { SobrietyCounter } from '@/mobile/components/home/SobrietyCounter';
import { DailyReminders } from '@/mobile/components/home/DailyReminders';
import { CrisisButton } from '@/mobile/components/common/CrisisButton';
import { Colors } from '@/mobile/constants/Colors';
import { useUserGroups } from '@/mobile/hooks/useUserGroups';

export default function Home() {
	const insets = useSafeAreaInsets();
	const { groups, loading } = useUserGroups();

	const today = new Date();
	const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	const todayKey = weekDays[today.getDay()];

	console.log('todayKey:', todayKey);
	console.log('groups:', groups.map(g => ({ groupName: g.groupName, meetingSchedules: g.meetingSchedules })));

	const todaysMeetings = groups.flatMap(group =>
		(group.meetingSchedules || [])
			.filter(sch => sch.day === todayKey && sch.enabled)
			.map(sch => ({
				groupName: group.groupName || (group as any)['name'],
				time: sch.time,
			}))
	);

	const handleCrisisPress = () => {
		// TODO: Navigate to crisis management screen
	};

	return (
		<View style={styles.container}>
			<HomeHeader />
			<ScrollView
				style={styles.content}
				contentContainerStyle={[
					styles.contentContainer,
					{ paddingBottom: insets.bottom + 24 }
				]}
				showsVerticalScrollIndicator={false}
			>
				{/* Seção de reuniões de hoje */}
				{todaysMeetings.length > 0 && (
					<View style={{ marginBottom: 24 }}>
						<Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Reuniões de hoje</Text>
						{todaysMeetings.map((meeting, idx) => (
							<View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
								<Text style={{ fontSize: 16, fontWeight: '600' }}>{meeting.groupName}</Text>
								<Text style={{ fontSize: 16, marginLeft: 8, color: '#254A8E' }}>{meeting.time}</Text>
							</View>
						))}
					</View>
				)}
				<SobrietyCounter />
				<DailyReminders />
			</ScrollView>
			<CrisisButton onPress={handleCrisisPress} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	content: {
		flex: 1,
	},
	contentContainer: {
		flexGrow: 1,
	},
});