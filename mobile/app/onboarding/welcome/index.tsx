import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './_styles';
import { FEATURES, WELCOME_TEXT, INTRO_TEXT } from './_constants';

export default function WelcomeScreen() {
	const router = useRouter();
	const [showContent, setShowContent] = useState(false);
	const [showWhiteTransition, setShowWhiteTransition] = useState(false);
	const contentFadeAnim = useRef(new Animated.Value(0)).current;
	const welcomeFadeAnim = useRef(new Animated.Value(1)).current;

	const handleGetStarted = () => {
		router.push('/onboarding/personalInfo');
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			Animated.timing(welcomeFadeAnim, {
				toValue: 0,
				duration: 600,
				useNativeDriver: true,
			}).start(() => {
				requestAnimationFrame(() => {
					setShowWhiteTransition(true);

					setTimeout(() => {
						requestAnimationFrame(() => {
							setShowContent(true);
							Animated.timing(contentFadeAnim, {
								toValue: 1,
								duration: 800,
								useNativeDriver: true,
							}).start();
						});
					}, 300);
				});
			});
		}, 2000);

		return () => clearTimeout(timer);
	}, [contentFadeAnim, welcomeFadeAnim]);

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
							{ opacity: welcomeFadeAnim }
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
					{ opacity: contentFadeAnim }
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

				<View style={styles.footer}>
					<Pressable onPress={handleGetStarted} style={styles.buttonContainer}>
						<Text style={styles.buttonText}>Começar minha jornada</Text>
					</Pressable>
					<Text style={styles.privacyText}>
						Ao continuar, você concorda com nossos <Text style={styles.link}>Termos de Uso</Text> e <Text style={styles.link}>Política de Privacidade</Text>
					</Text>
				</View>
			</Animated.View>
		</SafeAreaView>
	);
}
