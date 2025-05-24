import { StyleSheet } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';

export const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
		paddingVertical: 24,
	},
	card: {
		backgroundColor: Colors.containers.blueLight,
		borderRadius: 20,
		padding: 24,
		paddingHorizontal: 28,
		shadowColor: Colors.light.shadow,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 8,
	},
	content: {
		flex: 1,
	},
	label: {
		fontSize: 16,
		color: Colors.light.background,
		opacity: 0.9,
		textTransform: 'uppercase',
		letterSpacing: 1,
	},
	days: {
		fontSize: 72,
		fontWeight: '700',
		color: Colors.light.background,
		marginTop: 8,
		lineHeight: 72,
		marginBottom: 24,
	},
	milestoneContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 8,
		justifyContent: 'center',
	},
	milestoneItem: {
		alignItems: 'center',
	},
	milestoneIcon: {
		width: 32,
		height: 32,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 4,
	},
	milestoneIconCompleted: {
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
	},
	milestoneIconUpcoming: {
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
	},
	milestoneIconCurrent: {
		backgroundColor: Colors.light.background,
		transform: [{ scale: 1.2 }],
	},
	milestoneDays: {
		fontSize: 8,
		color: Colors.light.background,
		opacity: 0.6,
		textAlign: 'center',
	},
	connector: {
		height: 1,
		flex: 1,
		marginHorizontal: 0,
		marginBottom: 12,
		backgroundColor: 'rgba(255, 255, 255, 0.15)',
		borderStyle: 'dashed',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.15)',
	},
	connectorCompleted: {
		backgroundColor: 'rgba(255, 255, 255, 0.3)',
		borderStyle: 'solid',
		borderColor: 'rgba(255, 255, 255, 0.3)',
	},
});
