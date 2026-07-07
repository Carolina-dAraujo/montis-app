import { StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';

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
		gap: 12,
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
		paddingTop: 8,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: Colors.light.text,
	},
	saveButton: {
		marginTop: 32,
		marginBottom: 16,
		backgroundColor: Colors.containers.blue,
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: 'center',
	},
	saveButtonText: {
		color: Colors.light.background,
		fontSize: 16,
		fontWeight: '500',
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	profileSection: {
		alignItems: 'center',
		marginBottom: 32,
	},
	profileImageContainer: {
		position: 'relative',
		marginBottom: 12,
	},
	profileImage: {
		width: 120,
		height: 120,
		borderRadius: 60,
	},
	editOverlay: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: Colors.black,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: Colors.light.background,
	},
	nameContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	name: {
		fontSize: 18,
		color: Colors.light.text,
		fontWeight: '500',
	},
	formSection: {
		gap: 24,
	},
	moreOptionsButton: {
		paddingHorizontal: 0,
	},
	deleteSection: {
		paddingVertical: 16,
		paddingHorizontal: 20,
	},
	deleteText: {
		color: Colors.light.text,
		fontSize: 16,
		fontWeight: '500',
	},
	separator: {
		height: 1,
		backgroundColor: Colors.light.shadow,
		marginHorizontal: 20,
	},
	fieldButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: Colors.input,
		borderRadius: 12,
		padding: 16,
	},
	fieldLabel: {
		fontSize: 14,
		color: Colors.light.text,
		fontWeight: '500',
		marginBottom: 4,
	},
	fieldValue: {
		fontSize: 16,
		color: Colors.icon.gray,
	},
	fieldContainer: {
		gap: 8,
	},
});
