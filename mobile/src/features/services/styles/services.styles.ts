import { StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	header: {
		padding: 20,
		paddingBottom: 32,
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
	options: {
		paddingHorizontal: 20,
	},
	option: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16,
	},
	serviceImage: {
		width: 40,
		height: 40,
		marginRight: 16,
	},
	optionContent: {
		flex: 1,
	},
	optionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.light.text,
		marginBottom: 4,
	},
	optionDescription: {
		fontSize: 14,
		color: Colors.icon.gray,
	},
});
