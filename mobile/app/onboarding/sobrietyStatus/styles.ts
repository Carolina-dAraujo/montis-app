import { StyleSheet } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';

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
		paddingRight: 60,
	},
	backIconContainer: {
		paddingTop: 8,
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
	subtitle: {
		fontSize: 16,
		color: Colors.icon.gray,
		lineHeight: 24,
		paddingHorizontal: 20,
		alignSelf: 'center',
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	options: {
		gap: 16,
	},
	option: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.light.background,
		borderRadius: 12,
		padding: 20,
		borderWidth: 1,
		borderColor: Colors.light.shadow,
		gap: 16,
	},
	optionSelected: {
		borderColor: Colors.containers.blue,
		backgroundColor: Colors.light.background,
		boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: Colors.lightGray,
		alignItems: 'center',
		justifyContent: 'center',
	},
	iconContainerSelected: {
		backgroundColor: Colors.containers.blueLight,
	},
	optionContent: {
		flex: 1,
	},
	optionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 4,
	},
	optionDescription: {
		fontSize: 14,
		color: Colors.icon.gray,
		lineHeight: 20,
	},
	footer: {
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
});
