import { View, Text, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '@/features/onboarding/styles/welcome.styles';
import { primaryButtonStyles } from '@/features/onboarding/styles/primaryButton.styles';
import { FEATURES, WELCOME_TEXT, INTRO_TEXT } from '@/features/onboarding/constants/welcome';
import { useWelcomeIntroAnimation } from '@/features/onboarding/hooks/useWelcomeIntroAnimation';

export default function Welcome() {
	const router = useRouter();
	const {
		showContent,
		showWhiteTransition,
		contentFadeAnim,
		welcomeFadeAnim,
	} = useWelcomeIntroAnimation();

	const handleGetStarted = () => {
		router.push('/onboarding/personal-info');
	};

	if (showWhiteTransition && !showContent) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.whiteTransition} />
			</SafeAreaView>
		);
	}

	if (!showContent) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.welcomeContainer}>
					<Animated.View
						style={[
							styles.welcomeAnimation,
							{ opacity: welcomeFadeAnim },
						]}
					>
						<Text style={styles.welcomeAnimationText}>{WELCOME_TEXT.title}</Text>
						<Text style={styles.welcomeAnimationTitle}>{WELCOME_TEXT.subtitle}</Text>
					</Animated.View>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<Animated.View
				style={[
					styles.content,
					{ opacity: contentFadeAnim },
				]}
			>
				<View style={styles.mainContent}>
					<View style={styles.header}>
						<View style={styles.brandContainer}>
							<Text style={styles.welcomeText}>{WELCOME_TEXT.title}</Text>
							<Text style={styles.title}>{WELCOME_TEXT.subtitle}</Text>
						</View>
						<View style={styles.subtitleContainer}>
							<Text style={styles.subtitle}>
								{WELCOME_TEXT.message}
							</Text>
						</View>
					</View>

					<View style={styles.messageContainer}>
						<Text style={styles.message}>
							{INTRO_TEXT}
						</Text>
					</View>

					<View style={styles.featuresContainer}>
						{FEATURES.map((feature, index) => (
							<View key={index} style={styles.feature}>
								<View style={styles.bullet} />
								<View style={styles.featureContent}>
									<Text style={styles.featureTitle}>{feature.title}</Text>
									<Text style={styles.featureDescription}>
										{feature.description}
									</Text>
								</View>
							</View>
						))}
					</View>
				</View>

				<View style={primaryButtonStyles.footer}>
					<Pressable onPress={handleGetStarted} style={primaryButtonStyles.buttonContainer}>
						<Text style={primaryButtonStyles.buttonText}>Começar minha jornada</Text>
					</Pressable>
					<Text style={primaryButtonStyles.privacyText}>
						Ao continuar, você concorda com nossos{' '}
						<Text style={primaryButtonStyles.link} onPress={() => router.push('/legal/terms')}>Termos de Uso</Text> e{' '}
						<Text style={primaryButtonStyles.link} onPress={() => router.push('/legal/privacy')}>Política de Privacidade</Text>.
					</Text>
				</View>
			</Animated.View>
		</SafeAreaView>
	);
}
