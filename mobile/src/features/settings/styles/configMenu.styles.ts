import { StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	header: {
		paddingBottom: 28,
		paddingHorizontal: 20,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	backIconContainer: {
		paddingTop: 8,
	},
	backButton: {
		paddingRight: 8,
		paddingVertical: 8
	},
	titleContainer: {
		paddingTop: 8,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		gap: 24,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: Colors.light.text,
	},
});
