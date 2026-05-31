import { StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	header: {
		paddingBottom: 28,
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
		marginBottom: 32,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.light.text,
		marginBottom: 16,
	},
	preferenceItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 16,
		paddingHorizontal: 16,
		backgroundColor: Colors.light.background,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.input,
		marginBottom: 12,
	},
	preferenceInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
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
		marginRight: 12,
	},
	preferenceTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 4,
	},
	preferenceDescription: {
		fontSize: 14,
		color: Colors.icon.gray,
		lineHeight: 20,
	},
	frequencyButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		backgroundColor: Colors.lightGray,
		borderWidth: 1,
		borderColor: Colors.input,
		minWidth: 100,
		maxWidth: 140,
	},
	frequencyButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: Colors.light.text,
		flex: 1,
		textAlign: 'center',
	},
	frequencySelector: {
		marginTop: 8,
		padding: 12,
		backgroundColor: Colors.lightGray,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.input,
	},
	frequencyOption: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		marginBottom: 8,
	},
	frequencyOptionSelected: {
		backgroundColor: Colors.containers.blue,
	},
	frequencyOptionTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 2,
	},
	frequencyOptionTitleSelected: {
		color: Colors.light.background,
	},
	frequencyOptionDescription: {
		fontSize: 12,
		color: Colors.icon.gray,
	},
	frequencyOptionDescriptionSelected: {
		color: Colors.light.background,
	},
	disabledItem: {
		opacity: 0.6,
	},
	disabledIcon: {
		backgroundColor: Colors.lightGray,
	},
	disabledText: {
		color: Colors.icon.gray,
	},
	disabledButton: {
		backgroundColor: Colors.lightGray,
		borderColor: Colors.icon.gray,
	},
	frequencyCard: {
		backgroundColor: Colors.light.background,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.input,
		marginBottom: 12,
		overflow: 'hidden',
	},
	frequencyCardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 16,
		paddingHorizontal: 16,
	},
	frequencyCardText: {
		flex: 1,
		marginLeft: 12,
	},
	frequencyCardButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 16,
		paddingHorizontal: 16,
		backgroundColor: Colors.lightGray,
		borderTopWidth: 1,
		borderTopColor: Colors.input,
	},
	frequencyCardButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.light.text,
	},
});
