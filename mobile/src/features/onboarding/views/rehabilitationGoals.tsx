import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/shared/theme/colors';
import { ChevronLeft } from 'lucide-react-native';
import { useOnboarding } from '@/features/onboarding/context/OnboardingProvider';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { styles } from '@/features/onboarding/styles/rehabilitationGoals.styles';
import { primaryButtonStyles } from '@/features/onboarding/styles/primaryButton.styles';
import { rehabilitationGoals } from '@/features/onboarding/constants/rehabilitationGoals';

export default function RehabilitationGoals() {
	const router = useRouter();
	const { onboardingData, updateOnboardingData } = useOnboarding();
	const [selectedGoals, setSelectedGoals] = useState<string[]>(
		onboardingData.rehabilitationGoals || []
	);
	const [error, setError] = useState<string | null>(null);

	const handleGoalToggle = (goalId: string) => {
		setSelectedGoals(prev => {
			if (prev.includes(goalId)) {
				return prev.filter(id => id !== goalId);
			} else {
				return [...prev, goalId];
			}
		});
	};

	const handleNext = () => {
		if (selectedGoals.length === 0) {
			setError('Selecione pelo menos um objetivo');
			return;
		}

		updateOnboardingData({
			rehabilitationGoals: selectedGoals
		});

		router.push('/onboarding/preferences');
	};

	const handleBack = () => {
		router.back();
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<View style={styles.backIconContainer}>
						<TouchableOpacity style={styles.backButton} onPress={handleBack}>
					<ChevronLeft size={24} color={Colors.icon.gray} />
				</TouchableOpacity>
					</View>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Quais são suas prioridades?</Text>
					</View>
				</View>
				<Text style={styles.subtitle}>
					Selecione as metas que são importantes para você
				</Text>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.goals}>
					{rehabilitationGoals.map((goal) => (
						<Pressable
							key={goal.id}
							style={[
								styles.goal,
								selectedGoals.includes(goal.id) && styles.goalSelected,
							]}
							onPress={() => handleGoalToggle(goal.id)}
						>
							<View style={[
								styles.iconContainer,
								selectedGoals.includes(goal.id) && styles.iconContainerSelected
							]}>
								<MaterialCommunityIcons
									name={goal.icon}
									size={24}
									color={selectedGoals.includes(goal.id) ? '#FFFFFF' : Colors.icon.gray}
								/>
							</View>
							<View style={styles.goalContent}>
								<Text style={styles.goalTitle}>{goal.title}</Text>
								<Text style={styles.goalDescription}>{goal.description}</Text>
							</View>
							<View style={[
								styles.checkbox,
								selectedGoals.includes(goal.id) && styles.checkboxSelected
							]}>
								{selectedGoals.includes(goal.id) && (
									<MaterialCommunityIcons
										name="check"
										size={16}
										color="#FFFFFF"
									/>
								)}
							</View>
						</Pressable>
					))}
				</View>

				<View style={styles.infoBox}>
					<Text style={styles.infoTitle}>💡 Dica</Text>
					<Text style={styles.infoText}>
						Você pode selecionar quantos objetivos quiser. Todos são válidos e importantes para sua jornada de recuperação.
					</Text>
				</View>
			</ScrollView>

			<View style={styles.footer}>
				<Pressable
					onPress={handleNext}
					style={[primaryButtonStyles.buttonContainer, selectedGoals.length === 0 && { opacity: 0.5 }]}
					disabled={selectedGoals.length === 0}
				>
					<Text style={primaryButtonStyles.buttonText}>Continuar</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}
