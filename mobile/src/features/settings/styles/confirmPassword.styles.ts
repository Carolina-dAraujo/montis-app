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
		justifyContent: 'space-between',
		paddingRight: 20,
	},
	backIconContainer: {
		paddingTop: 8,
	},
	backButton: {
		padding: 8,
	},
	titleContainer: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 8,
	},
	title: {
		fontSize: 16,
		paddingLeft: 20,
		fontWeight: '500',
		color: Colors.light.text,
	},
	prontoButtonContainer: {
		paddingTop: 8,
	},
	prontoButton: {
		fontSize: 16,
		fontWeight: '500',
		color: Colors.containers.blue,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	description: {
		fontSize: 14,
		color: Colors.icon.gray,
		marginBottom: 16,
	},
});
