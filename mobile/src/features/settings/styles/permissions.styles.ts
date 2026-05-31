import { StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	header: {
		paddingBottom: 8,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	backIconContainer: {
		paddingTop: 8,
	},
	backButton: {
		padding: 8,
	},
	titleContainer: {
		paddingTop: 8,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: Colors.light.text,
	},
	section: {
		marginBottom: 24,
	},
	sectionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.light.text,
	},
	sectionDescription: {
		fontSize: 14,
		color: Colors.icon.gray,
		lineHeight: 20,
		marginBottom: 16,
	},
	permissionCard: {
		backgroundColor: Colors.light.background,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.input,
		overflow: 'hidden',
	},
	permissionContent: {
		padding: 20,
	},
	permissionInfo: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.lightGray,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	textContainer: {
		flex: 1,
	},
	permissionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 4,
	},
	permissionDescription: {
		fontSize: 14,
		color: Colors.icon.gray,
		lineHeight: 20,
		marginBottom: 4,
	},
	permissionStatus: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	statusText: {
		fontSize: 11,
		fontWeight: '600',
	},
	actionButton: {
		paddingVertical: 16,
		paddingHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'center',
		borderTopWidth: 1,
		borderTopColor: Colors.input,
	},
	actionButtonActive: {
		backgroundColor: Colors.lightGray,
	},
	actionButtonInactive: {
		backgroundColor: Colors.containers.blue,
	},
	actionButtonText: {
		fontSize: 14,
		fontWeight: '500',
		color: Colors.light.text,
	},
	actionButtonTextActive: {
		fontWeight: 'bold',
	},
	infoSection: {
		marginTop: 16,
	},
	infoContainer: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		padding: 16,
		backgroundColor: Colors.lightGray,
		borderRadius: 12,
	},
	infoText: {
		fontSize: 14,
		color: Colors.icon.gray,
		lineHeight: 20,
		marginLeft: 8,
		flex: 1,
	},
	titleRow: {
		flexDirection: 'row',
		alignItems: 'baseline',
		gap: 8,
	},
});
