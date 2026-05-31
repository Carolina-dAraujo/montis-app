import { View, Text, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '@/shared/theme/colors';
import { GroupDetailHeader } from '@/features/groups/components/GroupDetailHeader';
import { styles } from '@/features/groups/styles/groupDetail.styles';

type GroupDetailLoadingProps = {
	shimmerAnim: Animated.Value;
	onBack: () => void;
};

export function GroupDetailLoading({ shimmerAnim, onBack }: GroupDetailLoadingProps) {
	return (
		<SafeAreaView style={styles.container}>
			<GroupDetailHeader
				title="Carregando..."
				notificationsEnabled={false}
				onBack={onBack}
				onToggleNotifications={() => {}}
				showNotificationToggle={false}
			/>
			<View style={styles.loadingContainer}>
				<Animated.View
					style={[
						styles.loadingIcon,
						{
							opacity: shimmerAnim.interpolate({
								inputRange: [0, 1],
								outputRange: [0.4, 1],
							}),
						},
					]}
				>
					<MaterialCommunityIcons
						name="account-group"
						size={48}
						color={Colors.containers.blue}
					/>
				</Animated.View>
				<Text style={styles.loadingText}>Carregando...</Text>
			</View>
		</SafeAreaView>
	);
}
