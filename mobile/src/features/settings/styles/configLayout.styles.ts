import { StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';

export const configLayoutStyles = StyleSheet.create({
	header: {
		paddingBottom: 16,
		paddingHorizontal: 20,
	},
	headerCompact: {
		paddingBottom: 16,
		paddingHorizontal: 20,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	headerRowSpaced: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	backButton: {
		marginLeft: -8,
		padding: 8,
	},
	titleContainer: {
		flex: 1,
		alignItems: 'center',
	},
	titleContainerLeft: {
		flex: 1,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: Colors.light.text,
	},
	titleCentered: {
		fontSize: 16,
		fontWeight: '500',
		color: Colors.light.text,
		textAlign: 'center',
	},
	headerSpacer: {
		width: 40,
	},
	rightAction: {
		minWidth: 40,
		alignItems: 'flex-end',
		marginRight: -8,
		padding: 8,
	},
	prontoButton: {
		fontSize: 16,
		fontWeight: '500',
		color: Colors.containers.blue,
	},
	prontoButtonDisabled: {
		opacity: 0.5,
	},
});
