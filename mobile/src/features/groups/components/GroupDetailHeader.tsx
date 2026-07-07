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
	onRemove?: () => void;
	showNotificationToggle?: boolean;
};

export function GroupDetailHeader({
	title,
	notificationsEnabled,
	onBack,
	onToggleNotifications,
	onRemove,
	showNotificationToggle = true,
}: GroupDetailHeaderProps) {
	return (
		<View style={styles.header}>
			<TouchableOpacity style={styles.backButton} onPress={onBack}>
				<ChevronLeft size={24} color={Colors.icon.gray} />
			</TouchableOpacity>
			<Text style={styles.headerTitle} numberOfLines={1}>
				{title}
			</Text>
			<View style={styles.headerSpacer} />
			{showNotificationToggle ? (
				<TouchableOpacity style={styles.headerAction} onPress={onToggleNotifications}>
					<MaterialCommunityIcons
						name={notificationsEnabled ? 'bell' : 'bell-outline'}
						size={20}
						color={notificationsEnabled ? Colors.containers.blue : Colors.icon.gray}
					/>
				</TouchableOpacity>
			) : null}
			{onRemove ? (
				<TouchableOpacity style={styles.headerAction} onPress={onRemove}>
					<MaterialCommunityIcons
						name="trash-can-outline"
						size={20}
						color={Colors.icon.gray}
					/>
				</TouchableOpacity>
			) : null}
		</View>
	);
}
