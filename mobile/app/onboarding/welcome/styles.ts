import { StyleSheet } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	content: {
		flex: 1,
		paddingHorizontal: 24,
	},
	mainContent: {
		flex: 1,
		paddingTop: 60,
	},
	header: {
		alignItems: 'center',
		marginBottom: 24,
	},
	brandContainer: {
		alignItems: 'center',
		marginBottom: 16,
	},
	welcomeText: {
		fontSize: 16,
		color: Colors.containers.blue,
		fontWeight: '500',
		marginBottom: 4,
		letterSpacing: 0.5,
		textTransform: 'uppercase',
	},
	title: {
		fontSize: 42,
		fontWeight: '700',
		color: Colors.light.text,
		textAlign: 'center',
		letterSpacing: -0.5,
		lineHeight: 46,
	},
	subtitleContainer: {
		marginTop: 8,
	},
	subtitle: {
		fontSize: 16,
		color: Colors.icon.gray,
		textAlign: 'center',
		lineHeight: 24,
		maxWidth: 280,
		fontWeight: '400',
	},
	messageContainer: {
		marginBottom: 32,
	},
	message: {
		fontSize: 15,
		color: Colors.light.text,
		textAlign: 'center',
		lineHeight: 24,
		fontStyle: 'italic',
	},
	featuresContainer: {
		paddingHorizontal: 12,
	},
	feature: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 24,
	},
	bullet: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: Colors.containers.blue,
		marginRight: 16,
		marginTop: 8,
		flexShrink: 0,
	},
	featureContent: {
		flex: 1,
	},
	featureTitle: {
		fontSize: 17,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 6,
	},
	featureDescription: {
		fontSize: 14,
		color: Colors.icon.gray,
		lineHeight: 22,
	},
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
	buttonText: {
		fontSize: 16,
		color: '#fff',
		fontWeight: '600',
		textAlign: 'center',
	},
	welcomeContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	welcomeAnimation: {
		alignItems: 'center',
	},
	welcomeAnimationText: {
		fontSize: 20,
		color: Colors.containers.blue,
		fontWeight: '500',
		marginBottom: 8,
		textTransform: 'uppercase',
	},
	welcomeAnimationTitle: {
		fontSize: 48,
		fontWeight: '700',
		color: Colors.light.text,
		textAlign: 'center',
	},
	whiteTransition: {
		flex: 1,
		backgroundColor: '#fff',
	},
}); 