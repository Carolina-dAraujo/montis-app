import { StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';

export const styles = StyleSheet.create({
	forgotPassword: {
		alignItems: 'flex-start',
		marginTop: 8,
		marginBottom: 12,
	},
	forgotPasswordText: {
		color: Colors.light.text,
		fontSize: 8,
	},
	linkText: {
		textAlign: 'center',
		fontSize: 8,
		color: Colors.light.text,
		marginTop: 0,
		marginBottom: 4,
	},
	linkBold: {
		fontWeight: 'bold',
	},
	separatorContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 20,
	},
	line: {
		flex: 1,
		height: 1,
		backgroundColor: Colors.light.icon,
	},
	separatorText: {
		marginHorizontal: 10,
		fontSize: 12,
		color: Colors.light.icon,
	},
});
