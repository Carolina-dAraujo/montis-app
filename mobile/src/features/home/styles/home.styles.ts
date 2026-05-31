import { StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	content: {
		flex: 1,
	},
	contentContainer: {
		flexGrow: 1,
	},
});
