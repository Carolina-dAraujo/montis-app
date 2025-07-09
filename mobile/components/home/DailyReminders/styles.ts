import { StyleSheet } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';

export const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	header: {
		marginBottom: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 14,
		color: Colors.light.text,
		opacity: 0.6,
	},
	remindersContainer: {
		gap: 24,
	},
	section: {
		gap: 12,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 4,
	},
	reminderButton: {
		flexDirection: 'row',
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: 16,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#E9ECEF',
		shadowColor: Colors.light.shadow,
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.2,
		shadowRadius: 16,
		elevation: 8,
	},
	checkInButton: {
		backgroundColor: Colors.containers.blue,
		borderColor: Colors.containers.blue,
	},
	checkInButtonCompleted: {
		backgroundColor: Colors.containers.blueLight,
		borderColor: Colors.containers.blueLight,
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: Colors.containers.blueLight,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16,
	},
	checkInIcon: {
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
	},
	checkInIconCompleted: {
		backgroundColor: Colors.light.background,
	},
	textContainer: {
		flex: 1,
	},
	reminderTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 4,
	},
	checkInTitle: {
		color: '#FFFFFF',
	},
	checkInTitleCompleted: {
		color: '#FFFFFF',
	},
	reminderTime: {
		fontSize: 14,
		color: Colors.light.text,
		opacity: 0.6,
	},
	checkInTime: {
		color: '#FFFFFF',
		opacity: 0.9,
	},
	checkInTimeCompleted: {
		color: '#F8FAFC',
		opacity: 0.9,
	},
	onlineTag: {
		fontSize: 12,
		color: Colors.containers.blue,
		marginTop: 4,
		fontWeight: '500',
	},
	emptyStateContainer: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: 24,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#E9ECEF',
		shadowColor: Colors.light.shadow,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	emptyStateIcon: {
		marginBottom: 12,
		opacity: 0.6,
	},
	emptyStateText: {
		fontSize: 14,
		color: Colors.light.text,
		opacity: 0.6,
		textAlign: 'center',
	},
	emptyStateAction: {
		fontSize: 12,
		color: Colors.containers.blue,
		fontWeight: '500',
		textAlign: 'center',
		marginTop: 8,
	},
});
