import { StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	scrollView: {
		flex: 1,
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
	card: {
		backgroundColor: Colors.light.background,
		borderRadius: 16,
		padding: 20,
		shadowColor: Colors.light.shadow,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	cardTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 16,
	},
	emergencyCard: {
		backgroundColor: Colors.light.background,
		borderRadius: 16,
		padding: 20,
		shadowColor: Colors.light.shadow,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 6,
	},
	emergencyButton: {
		backgroundColor: Colors.light.iconAlert,
		paddingVertical: 16,
		paddingHorizontal: 24,
		borderRadius: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	emergencyButtonActive: {
		backgroundColor: '#34C759',
	},
	emergencyButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8,
	},
	servicesContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	serviceCard: {
		width: '48%',
		backgroundColor: Colors.lightGray,
		padding: 16,
		borderRadius: 12,
		alignItems: 'center',
		marginBottom: 12,
	},
	serviceText: {
		fontSize: 14,
		fontWeight: '500',
		color: Colors.light.text,
		marginTop: 8,
		marginBottom: 4,
	},
	serviceNumber: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.containers.blue,
	},
	actionCard: {
		backgroundColor: Colors.lightGray,
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
		flexDirection: 'row',
		alignItems: 'center',
	},
	actionText: {
		fontSize: 16,
		color: Colors.light.text,
		marginLeft: 12,
		flex: 1,
	},
	infoCard: {
		backgroundColor: Colors.lightGray,
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
		flexDirection: 'row',
		alignItems: 'center',
	},
	infoText: {
		fontSize: 14,
		color: Colors.light.text,
		marginLeft: 12,
		flex: 1,
		lineHeight: 20,
	},
});
