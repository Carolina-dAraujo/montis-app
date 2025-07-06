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
		alignSelf: 'center',
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	form: {
		gap: 24,
	},
	dateContainer: {
		gap: 8,
	},
	daysText: {
		fontSize: 14,
		color: Colors.containers.blue,
		fontWeight: '600',
		marginTop: 8,
	},
	infoBox: {
		backgroundColor: Colors.lightGray,
		borderRadius: 12,
		padding: 16,
		borderLeftWidth: 4,
		borderLeftColor: Colors.containers.blue,
	},
	infoTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 8,
	},
	infoText: {
		fontSize: 14,
		color: Colors.icon.gray,
		lineHeight: 20,
	},
	footer: {
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
});
