import { View, Text } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/mobile/constants/Colors';
import { styles } from './styles';
import { Milestone } from './types';

type MilestoneItemProps = {
	milestone: Milestone;
	isCompleted: boolean;
	isCurrent: boolean;
};

export function MilestoneItem({ milestone, isCompleted, isCurrent }: MilestoneItemProps) {
	const getIconColor = () => {
		if (isCurrent) return Colors.containers.blue;
		if (isCompleted) return Colors.light.background;
		return Colors.light.shadow;
	};

	const renderIcon = () => {
		const iconProps = {
			name: isCompleted ? milestone.iconCompleted as any : milestone.icon as any,
			size: 16,
			color: getIconColor(),
		};

		if (milestone.library === 'MaterialCommunityIcons') {
			return <MaterialCommunityIcons {...iconProps} />;
		}
		return <Ionicons {...iconProps} />;
	};

	return (
		<View style={styles.milestoneItem}>
			<View style={[
				styles.milestoneIcon,
				isCompleted ? styles.milestoneIconCompleted : styles.milestoneIconUpcoming,
				isCurrent && styles.milestoneIconCurrent
			]}>
				{renderIcon()}
			</View>
			<Text style={styles.milestoneDays}>{milestone.days}d</Text>
		</View>
	);
}
