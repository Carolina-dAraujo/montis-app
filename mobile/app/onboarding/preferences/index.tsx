import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/mobile/constants/Colors';
import { ChevronLeft } from '@/mobile/components/icons/ChevronLeft';
import { useOnboarding, NotificationFrequency } from '@/mobile/contexts/OnboardingContext';
import { styles as welcomeButtonStyles } from '@/mobile/components/onboarding/styles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { styles } from './_styles';
import { notificationOptions } from './_constants';

export default function PreferencesScreen() {
	const router = useRouter();
	const { onboardingData, updateOnboardingData } = useOnboarding();
	const [dailyReminders, setDailyReminders] = useState(onboardingData.dailyReminders ?? true);
	const [notificationFrequency, setNotificationFrequency] = useState<NotificationFrequency>(
		onboardingData.notificationFrequency as NotificationFrequency ?? NotificationFrequency.DAILY
	);
	const [crisisSupport, setCrisisSupport] = useState(onboardingData.crisisSupport ?? true);
	const [shareProgress, setShareProgress] = useState(onboardingData.shareProgress ?? false);

	const handleNext = () => {
		updateOnboardingData({
			dailyReminders,
			notificationFrequency,
			crisisSupport,
			shareProgress,
		});

		router.push('/onboarding/completion');
	};

	const handleSkip = () => {
		updateOnboardingData({
			dailyReminders: true,
			notificationFrequency: NotificationFrequency.DAILY,
			crisisSupport: true,
			shareProgress: false,
		});

		router.push('/onboarding/completion');
	};

	const handleBack = () => {
		router.back();
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<View style={styles.backIconContainer}>
						<ChevronLeft onPress={handleBack} />
					</View>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Suas preferências</Text>
					</View>
				</View>
				<Text style={styles.subtitle}>
					Personalize sua experiência no app
				</Text>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<MaterialCommunityIcons name="bell" size={20} color={Colors.containers.blue} />
						<Text style={styles.sectionTitle}>Notificações</Text>
					</View>

					<View style={styles.setting}>
						<View style={styles.settingInfo}>
							<Text style={styles.settingTitle}>Lembretes diários</Text>
							<Text style={styles.settingDescription}>
								Receber lembretes para manter sua sobriedade
							</Text>
						</View>
						<Switch
							value={dailyReminders}
							onValueChange={setDailyReminders}
							trackColor={{ false: Colors.light.shadow, true: Colors.containers.blue }}
							thumbColor={dailyReminders ? 'white' : '#f4f3f4'}
						/>
					</View>

					{dailyReminders && (
						<View style={styles.frequencyContainer}>
							<Text style={styles.frequencyLabel}>Frequência dos lembretes</Text>
							{notificationOptions.map((option) => (
								<Pressable
									key={option.id}
									style={[
										styles.frequencyOption,
										notificationFrequency === option.id && styles.frequencyOptionSelected,
									]}
									onPress={() => setNotificationFrequency(option.id)}
								>
									<Text style={styles.frequencyTitle}>{option.title}</Text>
									<Text style={styles.frequencyDescription}>{option.description}</Text>
								</Pressable>
							))}
						</View>
					)}
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<MaterialCommunityIcons name="help-circle" size={20} color={Colors.containers.blue} />
						<Text style={styles.sectionTitle}>Suporte de crise</Text>
					</View>

					<View style={styles.setting}>
						<View style={styles.settingInfo}>
							<Text style={styles.settingTitle}>Acesso rápido a ajuda</Text>
							<Text style={styles.settingDescription}>
								Mostrar recursos de ajuda em momentos difíceis
							</Text>
						</View>
						<Switch
							value={crisisSupport}
							onValueChange={setCrisisSupport}
							trackColor={{ false: Colors.light.shadow, true: Colors.containers.blue }}
							thumbColor={crisisSupport ? 'white' : '#f4f3f4'}
						/>
					</View>
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<MaterialCommunityIcons name="share" size={20} color={Colors.containers.blue} />
						<Text style={styles.sectionTitle}>Compartilhamento</Text>
					</View>

					<View style={styles.setting}>
						<View style={styles.settingInfo}>
							<Text style={styles.settingTitle}>Compartilhar progresso</Text>
							<Text style={styles.settingDescription}>
								Compartilhar conquistas com amigos e família (opcional)
							</Text>
						</View>
						<Switch
							value={shareProgress}
							onValueChange={setShareProgress}
							trackColor={{ false: Colors.light.shadow, true: Colors.containers.blue }}
							thumbColor={shareProgress ? 'white' : '#f4f3f4'}
						/>
					</View>
				</View>

				<View style={styles.infoBox}>
					<View style={styles.infoHeader}>
						<MaterialCommunityIcons name="shield-check" size={16} color={Colors.containers.blue} />
						<Text style={styles.infoTitle}>Privacidade</Text>
					</View>
					<Text style={styles.infoText}>
						Todas as suas informações são mantidas em sigilo. Você pode alterar essas configurações a qualquer momento.
					</Text>
				</View>
			</ScrollView>

			<View style={styles.footer}>
				<Pressable
					onPress={handleNext}
					style={welcomeButtonStyles.buttonContainer}
				>
					<Text style={welcomeButtonStyles.buttonText}>Continuar</Text>
				</Pressable>
				<Pressable
					onPress={handleSkip}
					style={styles.skipButton}
				>
					<Text style={styles.skipButtonText}>Pular</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}
