import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeHeader } from '@/mobile/components/home/HomeHeader';
import { SobrietyCounter } from '@/mobile/components/home/SobrietyCounter';
import { DailyReminders } from '@/mobile/components/home/DailyReminders';
import { CrisisButton } from '@/mobile/components/common/CrisisButton';
import { Colors } from '@/mobile/constants/Colors';

export default function Home() {
	const insets = useSafeAreaInsets();

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