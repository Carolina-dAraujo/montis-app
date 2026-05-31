import { StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingTop: 16,
	},
	backButton: {
		paddingRight: 8,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.light.text,
	},
	headerSpacer: {
		flex: 1,
	},
	notificationButton: {
		padding: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	shareButton: {
		padding: 8,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		fontSize: 16,
		color: Colors.icon.gray,
		marginTop: 16,
		fontWeight: '500',
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorText: {
		fontSize: 16,
		color: Colors.icon.gray,
		marginTop: 16,
	},
	overviewSection: {
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	overviewCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	overviewHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	overviewInfo: {
		flex: 1,
		marginLeft: 12,
	},
	overviewTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.light.text,
		marginBottom: 4,
	},
	overviewSubtitle: {
		fontSize: 14,
		color: Colors.icon.gray,
		fontWeight: '500',
	},
	overviewStats: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	statItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	statText: {
		fontSize: 12,
		color: Colors.icon.gray,
		fontWeight: '500',
	},
	quickActions: {
		flexDirection: 'row',
		paddingHorizontal: 20,
		paddingTop: 16,
		gap: 12,
	},
	actionButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.containers.blue,
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 12,
		gap: 8,
	},
	actionText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	infoSection: {
		paddingHorizontal: 20,
		paddingTop: 24,
		gap: 12,
	},
	infoCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: '#E9ECEF',
	},
	infoCardContent: {
		flex: 1,
	},
	phoneCard: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	infoHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
		gap: 8,
	},
	infoTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: Colors.light.text,
	},
	infoContent: {
		fontSize: 14,
		color: Colors.light.text,
		lineHeight: 20,
	},
	infoMeta: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		marginTop: 8,
	},
	infoMetaText: {
		fontSize: 12,
		color: Colors.icon.gray,
		fontWeight: '500',
	},
	schedulesSection: {
		paddingHorizontal: 20,
		paddingTop: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.light.text,
		marginBottom: 16,
	},
	schedulesList: {
		gap: 8,
	},
	scheduleItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#E9ECEF',
	},
	scheduleInfo: {
		flex: 1,
	},
	scheduleHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginBottom: 4,
	},
	scheduleDay: {
		fontSize: 14,
		fontWeight: '500',
		color: Colors.light.text,
	},
	scheduleTime: {
		fontSize: 12,
		color: Colors.icon.gray,
		marginTop: 2,
	},
	scheduleToggle: {
		width: 24,
		height: 24,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	meetingTimesList: {
		marginTop: 8,
		gap: 8,
	},
	meetingTimeItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 4,
		paddingHorizontal: 8,
		backgroundColor: '#F8F9FA',
		borderRadius: 6,
	},
	meetingTimeText: {
		fontSize: 12,
		color: Colors.light.text,
		fontWeight: '500',
	},
	skeletonTitle: {
		backgroundColor: '#E9ECEF',
		borderRadius: 4,
	},
	skeletonIcon: {
		backgroundColor: '#E9ECEF',
		borderRadius: 12,
	},
	skeletonText: {
		backgroundColor: '#E9ECEF',
		borderRadius: 4,
	},
	skeletonSwitch: {
		backgroundColor: '#E9ECEF',
		borderRadius: 16,
	},
	loadingIcon: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	locationActions: {
		flexDirection: 'row',
		marginTop: 12,
		gap: 12,
	},
	locationActionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingVertical: 6,
		backgroundColor: '#F8F9FA',
		borderRadius: 8,
		gap: 4,
	},
	locationActionText: {
		fontSize: 12,
		color: Colors.icon.gray,
		fontWeight: '500',
	},
});
