import { Colors } from "@/mobile/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	header: {
		paddingBottom: 28,
        gap: 8,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingRight: 20,
	},
	backIconContainer: {
		paddingTop: 8,
	},
	backButton: {
		padding: 8,
	},
	titleContainer: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 8,
	},
	title: {
		fontSize: 16,
		fontWeight: '500',
		color: Colors.light.text,
	},
	prontoButtonContainer: {
		paddingRight: 20,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	form: {
		gap: 24,
	},
	label: {
		fontSize: 14,
		fontWeight: '500',
		color: Colors.light.text,
	},
	footer: {
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
    inputContainer: {
        gap: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.input,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: Colors.light.background,
        color: Colors.light.text,
    },
});
