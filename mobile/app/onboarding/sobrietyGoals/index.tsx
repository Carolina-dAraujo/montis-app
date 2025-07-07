import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/mobile/constants/Colors';
import { ChevronLeft } from 'lucide-react-native';
import { useOnboarding, SobrietyGoal } from '@/mobile/contexts/OnboardingContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { styles as welcomeButtonStyles } from 'app/onboarding/welcome/_styles';
import { styles } from './_styles';
import { goalOptions } from './_constants';

export default function SobrietyGoalsScreen() {
	const router = useRouter();
	const { onboardingData, updateOnboardingData } = useOnboarding();
	const [selectedGoal, setSelectedGoal] = useState<SobrietyGoal | undefined>(
		onboardingData.sobrietyGoal as SobrietyGoal ?? SobrietyGoal.ABSTINENCE
	);

	const handleNext = () => {
		if (!selectedGoal) return;

		updateOnboardingData({
			sobrietyGoal: selectedGoal
		});

		router.push('/onboarding/rehabilitationGoals');
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
						<Text style={styles.title}>Qual é seu objetivo?</Text>
					</View>
				</View>
				<Text style={styles.subtitle}>
					Escolha o que melhor representa sua jornada
				</Text>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.options}>
					{goalOptions.map((option) => (
						<Pressable
							key={option.id}
							style={[
								styles.option,
								selectedGoal === option.id && styles.optionSelected,
							]}
							onPress={() => setSelectedGoal(option.id)}
						>
							<View style={[
								styles.iconContainer,
								selectedGoal === option.id && styles.iconContainerSelected
							]}>
								<MaterialCommunityIcons
									name={option.icon}
									size={24}
									color={selectedGoal === option.id ? '#FFFFFF' : Colors.icon.gray}
								/>
							</View>
							<View style={styles.optionContent}>
								<Text style={styles.optionTitle}>{option.title}</Text>
								<Text style={styles.optionDescription}>{option.description}</Text>
							</View>
						</Pressable>
					))}
				</View>
			</ScrollView>

			<View style={styles.footer}>
				<Pressable
					onPress={handleNext}
					style={[welcomeButtonStyles.buttonContainer, !selectedGoal && { opacity: 0.5 }]}
					disabled={!selectedGoal}
				>
					<Text style={welcomeButtonStyles.buttonText}>Continuar</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}
