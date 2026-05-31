import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeHeader } from '@/features/home/components/HomeHeader';
import { SobrietyCounter } from '@/features/home/components/SobrietyCounter';
import { DailyReminders } from '@/features/home/components/DailyReminders';
import { styles } from '@/features/home/styles/home.styles';

export default function Home() {
	const insets = useSafeAreaInsets();

	return (
		<View style={styles.container}>
			<HomeHeader />
			<ScrollView
				style={styles.content}
				contentContainerStyle={[
					styles.contentContainer,
					{ paddingBottom: insets.bottom + 80 },
				]}
				showsVerticalScrollIndicator={false}
			>
				<SobrietyCounter />
				<DailyReminders />
			</ScrollView>
		</View>
	);
}
