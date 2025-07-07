import { Colors } from "@/mobile/constants/Colors";
import { StyleSheet } from "react-native";

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
	},
	sectionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: Colors.light.text,
	},
	setting: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 12,
	},
	settingInfo: {
		flex: 1,
		marginRight: 16,
	},
	settingTitle: {
		fontSize: 16,
		fontWeight: '500',
		color: Colors.light.text,
		marginBottom: 4,
	},
	settingDescription: {
		fontSize: 14,
		color: Colors.icon.gray,
		lineHeight: 18,
	},
	frequencyContainer: {
		marginTop: 16,
		gap: 8,
	},
	frequencyLabel: {
		fontSize: 14,
		fontWeight: '500',
		color: Colors.light.text,
		marginBottom: 8,
	},
	frequencyOption: {
		backgroundColor: Colors.light.background,
		borderRadius: 8,
		padding: 12,
		borderWidth: 1,
		borderColor: Colors.light.shadow,
	},
	frequencyOptionSelected: {
		borderColor: Colors.containers.blue,
		backgroundColor: Colors.light.background,
	},
	frequencyTitle: {
		fontSize: 14,
		fontWeight: '500',
		color: Colors.light.text,
		marginBottom: 2,
	},
	frequencyDescription: {
		fontSize: 12,
		color: Colors.icon.gray,
	},
	infoBox: {
		backgroundColor: Colors.lightGray,
		borderRadius: 12,
		padding: 16,
		borderLeftWidth: 4,
		borderLeftColor: Colors.containers.blue,
		marginBottom: 24,
	},
	infoHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginBottom: 8,
	},
	infoTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: Colors.light.text,
	},
	infoText: {
		fontSize: 14,
		color: Colors.icon.gray,
		lineHeight: 20,
	},
	footer: {
		paddingHorizontal: 20,
		paddingTop: 20,
		gap: 12,
	},
	skipButton: {
		alignItems: 'center',
		paddingVertical: 12,
	},
	skipButtonText: {
		fontSize: 16,
		color: Colors.icon.gray,
		fontWeight: '500',
	},
});
