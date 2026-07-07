import { View, Text, ScrollView, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/shared/theme/colors';
import { useOnboarding } from '@/features/onboarding/context/OnboardingProvider';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { onboardingApi } from '@/features/onboarding/api';
import { buildOnboardingPayload } from '@/features/onboarding/lib/buildOnboardingPayload';
import { storageService } from '@/shared/lib/storage';
import { primaryButtonStyles } from '@/features/onboarding/styles/primaryButton.styles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { styles } from '@/features/onboarding/styles/completion.styles';
import { usePreferences } from '@/features/settings/hooks/usePreferences';
import { NotificationFrequency } from '@/features/onboarding/types';

export default function Completion() {
	const router = useRouter();
	const { onboardingData, clearOnboardingData } = useOnboarding();
	const { updateUser, markOnboardingComplete } = useAuth();
	const { updatePreferences } = usePreferences();

	const handleCompleteOnboarding = async () => {
		try {
			const token = await storageService.getAuthToken();
			if (!token) {
				Alert.alert('Erro', 'Token de autenticação não encontrado');
				return;
			}

			const onboardingPayload = buildOnboardingPayload(onboardingData);

			await onboardingApi.completeOnboarding(token, onboardingPayload);

			await updatePreferences({
				dailyReminders: onboardingData.dailyReminders,
				notificationFrequency: onboardingData.notificationFrequency as NotificationFrequency | undefined,
				crisisSupport: onboardingData.crisisSupport,
				shareProgress: onboardingData.shareProgress,
			});

			// Don't clear onboarding data - we need it for the sobriety counter
			// clearOnboardingData();

			// Update user profile with display name
			if (onboardingData.displayName) {
				await updateUser({ displayName: onboardingData.displayName });
			}

			markOnboardingComplete();
			router.replace('/(tabs)/home');
		} catch (error) {
			console.error('CompletionScreen - Error completing onboarding:', error);
			const message = error instanceof Error
				? error.message
				: 'Não foi possível completar o onboarding. Tente novamente.';
			Alert.alert('Erro', message, [{ text: 'OK' }]);
		}
	};

	const formatDate = (dateString?: string) => {
		if (!dateString) return 'Não informado';
		return new Date(dateString).toLocaleDateString('pt-BR');
	};

	const getSobrietyGoalText = (goal?: string) => {
		switch (goal) {
			case 'abstinence':
				return 'Abstinência total';
			case 'reduction':
				return 'Redução gradual';
			case 'maintenance':
				return 'Manutenção';
			default:
				return 'Não informado';
		}
	};

	const getNotificationFrequencyText = (frequency?: string) => {
		switch (frequency) {
			case 'daily':
				return 'Diariamente';
			case 'weekly':
				return 'Semanalmente';
			case 'monthly':
				return 'Mensalmente';
			case 'never':
				return 'Nunca';
			default:
				return 'Não informado';
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Resumo do seu perfil</Text>
					</View>
				</View>
				<Text style={styles.subtitle}>
					Revise as informações antes de finalizar
				</Text>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<MaterialCommunityIcons name="account" size={20} color={Colors.icon.gray} />
						<Text style={styles.sectionTitle}>Informações pessoais</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Nome:</Text>
						<Text style={styles.infoValue}>{onboardingData.displayName}</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Telefone:</Text>
						<Text style={styles.infoValue}>{onboardingData.phone || 'Não informado'}</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Data de nascimento:</Text>
						<Text style={styles.infoValue}>{formatDate(onboardingData.birthDate)}</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Endereço:</Text>
						<Text style={styles.infoValue}>{onboardingData.address || 'Não informado'}</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Cidade:</Text>
						<Text style={styles.infoValue}>{onboardingData.city || 'Não informado'}</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Bairro:</Text>
						<Text style={styles.infoValue}>{onboardingData.neighborhood || 'Não informado'}</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>CEP:</Text>
						<Text style={styles.infoValue}>{onboardingData.cep || 'Não informado'}</Text>
					</View>
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<MaterialCommunityIcons name="target" size={20} color={Colors.icon.gray} />
						<Text style={styles.sectionTitle}>Objetivos de sobriedade</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Status atual:</Text>
						<Text style={styles.infoValue}>
							{onboardingData.isCurrentlySober ? 'Sóbrio' : 'Em processo'}
						</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Objetivo:</Text>
						<Text style={styles.infoValue}>{getSobrietyGoalText(onboardingData.sobrietyGoal)}</Text>
					</View>
					{onboardingData.isCurrentlySober ? (
						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Início da sobriedade:</Text>
							<Text style={styles.infoValue}>{formatDate(onboardingData.sobrietyStartDate)}</Text>
						</View>
					) : (
						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Última bebida:</Text>
							<Text style={styles.infoValue}>{formatDate(onboardingData.lastDrinkDate)}</Text>
						</View>
					)}
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<MaterialCommunityIcons name="cog" size={20} color={Colors.icon.gray} />
						<Text style={styles.sectionTitle}>Preferências</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Lembretes diários:</Text>
						<Text style={styles.infoValue}>
							{onboardingData.dailyReminders ? 'Ativados' : 'Desativados'}
						</Text>
					</View>
					{onboardingData.dailyReminders && (
						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Frequência:</Text>
							<Text style={styles.infoValue}>
								{getNotificationFrequencyText(onboardingData.notificationFrequency)}
							</Text>
						</View>
					)}
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Suporte de crise:</Text>
						<Text style={styles.infoValue}>
							{onboardingData.crisisSupport ? 'Ativado' : 'Desativado'}
						</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={styles.infoLabel}>Compartilhar progresso:</Text>
						<Text style={styles.infoValue}>
							{onboardingData.shareProgress ? 'Ativado' : 'Desativado'}
						</Text>
					</View>
				</View>

				<View style={styles.infoBox}>
					<View style={styles.infoHeader}>
						<MaterialCommunityIcons name="party-popper" size={20} color="#FFFFFF" />
						<Text style={styles.infoTitle}>Parabéns!</Text>
					</View>
					<Text style={styles.infoText}>
						Você deu o primeiro passo em sua jornada de recuperação.
						O Montis estará aqui para apoiá-lo em cada etapa.
					</Text>
				</View>
			</ScrollView>

			<View style={styles.footer}>
				<Pressable
					onPress={handleCompleteOnboarding}
					style={primaryButtonStyles.buttonContainer}
				>
					<Text style={primaryButtonStyles.buttonText}>Vamos lá!</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}
