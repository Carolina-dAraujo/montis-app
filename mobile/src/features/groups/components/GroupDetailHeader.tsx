import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '@/shared/theme/colors';
import { styles } from '@/features/groups/styles/groupDetail.styles';

type GroupDetailHeaderProps = {
	title: string;
	notificationsEnabled: boolean;
	onBack: () => void;
	onToggleNotifications: () => void;
	showNotificationToggle?: boolean;
};

export function GroupDetailHeader({
	title,
	notificationsEnabled,
	onBack,
	onToggleNotifications,
	showNotificationToggle = true,
}: GroupDetailHeaderProps) {
	return (
		<View style={styles.header}>
			<TouchableOpacity style={styles.backButton} onPress={onBack}>
				<ChevronLeft size={24} color={Colors.icon.gray} />
			</TouchableOpacity>
			<Text style={styles.headerTitle}>{title}</Text>
			<View style={styles.headerSpacer} />
			{showNotificationToggle ? (
				<TouchableOpacity style={styles.notificationButton} onPress={onToggleNotifications}>
					<MaterialCommunityIcons
						name={notificationsEnabled ? 'bell' : 'bell-outline'}
						size={20}
						color={notificationsEnabled ? Colors.containers.blue : Colors.icon.gray}
					/>
				</TouchableOpacity>
			) : (
				<View style={styles.notificationButton} />
			)}
		</View>
	);
}
