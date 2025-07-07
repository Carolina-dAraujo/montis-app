import { View, Text, ScrollView, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/mobile/constants/Colors';
import { useOnboarding } from '@/mobile/contexts/OnboardingContext';
import { useAuth } from '@/mobile/contexts/AuthContext';
import { apiService, OnboardingRequest } from '@/mobile/services/api';
import { storageService } from '@/mobile/services/storage';
import { styles as welcomeButtonStyles } from '../welcome/_styles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { styles } from './_styles'

export default function CompletionScreen() {
	const router = useRouter();
	const { onboardingData, clearOnboardingData } = useOnboarding();
	const { updateUser } = useAuth();

	const handleCompleteOnboarding = async () => {
		try {
			const token = await storageService.getAuthToken();
			if (!token) {
				Alert.alert('Erro', 'Token de autenticação não encontrado');
				return;
			}

			const requiredFields: Record<string, any> = {
				displayName: onboardingData.displayName,
				birthDate: onboardingData.birthDate,
				sobrietyGoal: onboardingData.sobrietyGoal,
				dailyReminders: onboardingData.dailyReminders,
				notificationFrequency: onboardingData.notificationFrequency,
				crisisSupport: onboardingData.crisisSupport,
				shareProgress: onboardingData.shareProgress,
			};

			if (onboardingData.isCurrentlySober) {
				requiredFields.sobrietyStartDate = onboardingData.sobrietyStartDate;
			}

			const missingFields = Object.entries(requiredFields)
				.filter(([key, value]) => value === undefined || value === null)
				.map(([key]) => key);

			if (missingFields.length > 0) {
				console.error('Missing required fields:', missingFields);
				Alert.alert('Erro', `Campos obrigatórios faltando: ${missingFields.join(', ')}`);
				return;
			}

			const onboardingPayload: Record<string, any> = {
				displayName: onboardingData.displayName!,
				phone: onboardingData.phone,
				birthDate: onboardingData.birthDate!,
				sobrietyGoal: onboardingData.sobrietyGoal!,
				lastDrinkDate: onboardingData.lastDrinkDate,
				dailyReminders: onboardingData.dailyReminders!,
				notificationFrequency: onboardingData.notificationFrequency!,
				crisisSupport: onboardingData.crisisSupport!,
				shareProgress: onboardingData.shareProgress!,
			};

			if (onboardingData.sobrietyStartDate) {
				onboardingPayload.sobrietyStartDate = onboardingData.sobrietyStartDate;
			}

			await apiService.completeOnboarding(token, onboardingPayload as OnboardingRequest);

			// Don't clear onboarding data - we need it for the sobriety counter
			// clearOnboardingData();

			// Update user profile with display name
			if (onboardingData.displayName) {
				updateUser({ displayName: onboardingData.displayName });
			}

			router.replace('/(tabs)/home');
		} catch (error) {
			console.error('CompletionScreen - Error completing onboarding:', error);
			Alert.alert(
				'Erro',
				'Não foi possível completar o onboarding. Tente novamente.',
				[{ text: 'OK' }]
			);
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
					style={welcomeButtonStyles.buttonContainer}
				>
					<Text style={welcomeButtonStyles.buttonText}>Vamos lá!</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}
