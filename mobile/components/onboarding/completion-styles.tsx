import { StyleSheet } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';

export const completionStyles = StyleSheet.create({
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
		paddingRight: 20,
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
	section: {
		marginBottom: 24,
		backgroundColor: Colors.lightGray,
		borderRadius: 12,
		padding: 16,
	},
	sectionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginBottom: 12,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.light.text,
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: Colors.input,
	},
	infoLabel: {
		fontSize: 14,
		color: Colors.icon.gray,
		flex: 1,
	},
	infoValue: {
		fontSize: 14,
		fontWeight: '500',
		color: Colors.light.text,
		flex: 1,
		textAlign: 'right',
	},
	infoBox: {
		backgroundColor: Colors.containers.blue,
		borderRadius: 12,
		padding: 16,
		marginBottom: 24,
	},
	infoHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginBottom: 8,
	},
	infoTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: 'white',
	},
	infoText: {
		fontSize: 14,
		color: 'white',
		lineHeight: 20,
		opacity: 0.9,
	},
	footer: {
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
}); 