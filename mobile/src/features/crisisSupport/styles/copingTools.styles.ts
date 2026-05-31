import { StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 16,
		paddingHorizontal: 20,
	},
	backButton: {
		paddingRight: 8
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: Colors.light.text,
		flex: 1,
		textAlign: 'center',
		marginHorizontal: 16,
	},
	headerSpacer: {
		width: 32,
	},
	content: {
		flex: 1,
	},
	section: {
		padding: 20,
		paddingBottom: 10,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 8,
	},
	sectionSubtitle: {
		fontSize: 14,
		color: Colors.light.icon,
		lineHeight: 20,
		marginBottom: 16,
	},
	toolCard: {
		backgroundColor: 'white',
		margin: 20,
		marginTop: 0,
		padding: 16,
		borderRadius: 12,
		shadowColor: Colors.light.shadow,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	toolCardContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16,
	},
	toolIconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: Colors.lightGray,
		alignItems: 'center',
		justifyContent: 'center',
	},
	toolInfo: {
		flex: 1,
	},
	toolTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 4,
	},
	toolDescription: {
		fontSize: 14,
		color: Colors.light.icon,
		lineHeight: 20,
	},
	exerciseView: {
		flex: 1,
		padding: 20,
	},
	exerciseContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	exerciseTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: Colors.light.text,
		textAlign: 'center',
		marginBottom: 8,
	},
	exerciseSubtitle: {
		fontSize: 16,
		color: Colors.light.icon,
		textAlign: 'center',
		marginBottom: 32,
		lineHeight: 22,
	},
	breathingContainer: {
		alignItems: 'center',
		marginBottom: 32,
	},
	breathingCircle: {
		width: 200,
		height: 200,
		borderRadius: 100,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 16,
	},
	breathingText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	breathingCount: {
		fontSize: 16,
		color: Colors.light.text,
		marginBottom: 32,
	},
	groundingSteps: {
		width: '100%',
	},
	groundingStep: {
		backgroundColor: 'white',
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
		shadowColor: Colors.light.shadow,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	stepNumber: {
		fontSize: 24,
		fontWeight: 'bold',
		color: Colors.light.tint,
		marginBottom: 8,
	},
	stepText: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 4,
	},
	stepHint: {
		fontSize: 14,
		color: Colors.light.icon,
		lineHeight: 20,
	},
	stopButton: {
		backgroundColor: Colors.light.tint,
		paddingHorizontal: 32,
		paddingVertical: 16,
		borderRadius: 12,
		marginTop: 32,
	},
	stopButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
	},
	infoSection: {
		padding: 20,
		paddingTop: 10,
	},
	infoTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 12,
	},
	infoCard: {
		backgroundColor: Colors.lightGray,
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	infoText: {
		fontSize: 14,
		color: Colors.light.text,
		marginLeft: 12,
		flex: 1,
		lineHeight: 20,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: Colors.light.text,
	},
});
