import { StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.containers.blue,
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		flexDirection: 'column',
		alignItems: 'flex-start',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
		gap: 36,
	},
	contentContainer: {
		flex: 1,
		width: '100%',
	},
	title: {
		fontSize: 20,
		fontWeight: '300',
		color: Colors.light.background,
		marginBottom: 8,
	},
	separator: {
		height: 1,
		backgroundColor: Colors.light.background,
		marginBottom: 8,
		opacity: 0.5,
		width: '100%',
	},
	accessContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: 8,
	},
	accessText: {
		fontSize: 14,
		fontWeight: '600',
		color: Colors.light.background,
	},
});
