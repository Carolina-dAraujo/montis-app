import { StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	header: {
		padding: 20,
		paddingBottom: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: Colors.light.text,
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: Colors.icon.gray,
	},
	content: {
		paddingHorizontal: 20,
		paddingTop: 16,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 140,
	},
	loadingText: {
		fontSize: 16,
		color: Colors.icon.gray,
		marginTop: 16,
		fontWeight: '500',
	},
	loadingAnimation: {
		alignItems: 'center',
		marginBottom: 8,
	},
	loadingDots: {
		flexDirection: 'row',
		marginTop: 16,
		gap: 8,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: Colors.containers.blue,
	},
	emptyState: {
		height: '70%',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: Colors.light.text,
		marginTop: 20,
		marginBottom: 8,
	},
	emptySubtitle: {
		fontSize: 14,
		color: Colors.icon.gray,
		textAlign: 'center',
		marginBottom: 32,
	},
	addButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.containers.blue,
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 20,
		gap: 6,
	},
	addButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	fab: {
		position: 'absolute',
		right: 20,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: Colors.containers.blue,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000,
		shadowColor: Colors.light.shadow,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	groupCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		marginBottom: 8,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 4,
		borderWidth: 0,
	},
	cardContent: {
		padding: 16,
		flexDirection: 'row',
		alignItems: 'center',
	},
	mainInfo: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	groupName: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.light.text,
	},
	typeBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		alignSelf: 'flex-start',
	},
	typeText: {
		fontSize: 12,
		color: '#FFFFFF',
		fontWeight: 'bold',
		marginLeft: 4,
	},
	notificationButton: {
		padding: 4,
		justifyContent: 'center',
		alignItems: 'center',
	},

});
