import { StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';

export const primaryButtonStyles = StyleSheet.create({
	footer: {
		paddingBottom: 20,
	},
	buttonContainer: {
		backgroundColor: Colors.light.text,
		padding: 16,
		borderRadius: 12,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 16,
		color: '#fff',
		fontWeight: '600',
		textAlign: 'center',
	},
	privacyText: {
		fontSize: 12,
		color: Colors.icon.gray,
		textAlign: 'center',
		marginTop: 8,
		lineHeight: 18,
	},
	link: {
		color: Colors.containers.blue,
		textDecorationLine: 'underline',
	},
});
