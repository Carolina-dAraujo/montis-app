import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useOnboarding } from '@/features/onboarding/context/OnboardingProvider';
import { Colors } from '@/shared/theme/colors';
import { styles } from '@/features/onboarding/styles/sobrietyTimeline.styles';
import { primaryButtonStyles } from '@/features/onboarding/styles/primaryButton.styles';
import { CustomDateInput } from '@/shared/components/inputs/CustomDateInput';

export default function SobrietyTimeline() {
	const router = useRouter();
	const { onboardingData, updateOnboardingData } = useOnboarding();
	const [sobrietyStartDate, setSobrietyStartDate] = useState<Date | null>(
		onboardingData.sobrietyStartDate ? new Date(onboardingData.sobrietyStartDate) : null
	);
	const [lastDrinkDate, setLastDrinkDate] = useState<Date | null>(
		onboardingData.lastDrinkDate ? new Date(onboardingData.lastDrinkDate) : null
	);
	const [errors, setErrors] = useState<{ sobrietyStartDate?: string; lastDrinkDate?: string }>({});

	const isCurrentlySober = onboardingData.isCurrentlySober;

	const handleNext = async () => {
		if (isCurrentlySober && !sobrietyStartDate) {
			setErrors({ sobrietyStartDate: 'Data de início da sobriedade é obrigatória' });
			return;
		}

		if (!isCurrentlySober && !lastDrinkDate) {
			setErrors({ lastDrinkDate: 'Data da última bebida é obrigatória' });
			return;
		}

		if (isCurrentlySober) {
			updateOnboardingData({
				sobrietyStartDate: sobrietyStartDate?.toISOString(),
				lastDrinkDate: undefined,
			});
		} else {
			updateOnboardingData({
				lastDrinkDate: lastDrinkDate?.toISOString(),
				sobrietyStartDate: undefined,
			});
		}

		router.push('/onboarding/sobriety-goals');
	};

	const handleBack = () => {
		router.back();
	};

	const handleStartDateChange = (date: Date) => {
		setSobrietyStartDate(date);
		setErrors(prev => ({ ...prev, sobrietyStartDate: undefined }));
	};

	const handleLastDrinkDateChange = (date: Date) => {
		setLastDrinkDate(date);
		setErrors(prev => ({ ...prev, lastDrinkDate: undefined }));
	};

	const calculateDays = (date: Date) => {
		const today = new Date();
		const diffTime = Math.abs(today.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
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
						<Text style={styles.title}>
							{isCurrentlySober ? 'Quando você começou?' : 'Quando foi sua última bebida?'}
						</Text>
					</View>
				</View>
				<Text style={styles.subtitle}>
					{isCurrentlySober
						? 'Isso nos ajudará a acompanhar seu progresso'
						: 'Isso nos ajudará a definir seu ponto de partida'
					}
				</Text>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.form}>
					{isCurrentlySober ? (
						<View style={styles.dateContainer}>
							<CustomDateInput
								value={sobrietyStartDate}
								onChange={handleStartDateChange}
								label="Data de início da sobriedade"
								placeholder="Selecione a data"
								error={errors.sobrietyStartDate}
								maximumDate={new Date()}
								minimumDate={new Date(2020, 0, 1)}
							/>
							{sobrietyStartDate && (
								<Text style={styles.daysText}>
									{calculateDays(sobrietyStartDate)} dias de sobriedade! 🎉
								</Text>
							)}
						</View>
					) : (
						<View style={styles.dateContainer}>
							<CustomDateInput
								value={lastDrinkDate}
								onChange={handleLastDrinkDateChange}
								label="Data da última bebida"
								placeholder="Selecione a data"
								error={errors.lastDrinkDate}
								maximumDate={new Date()}
								minimumDate={new Date(2020, 0, 1)}
							/>
							{lastDrinkDate && (
								<Text style={styles.daysText}>
									{calculateDays(lastDrinkDate)} dias desde a última bebida
								</Text>
							)}
						</View>
					)}

					<View style={styles.infoBox}>
						<Text style={styles.infoTitle}>💡 Informação importante</Text>
						<Text style={styles.infoText}>
							{isCurrentlySober
								? 'Sua jornada de sobriedade já começou! Vamos celebrar cada dia de conquista.'
								: 'Não se preocupe se não lembrar a data exata. Uma aproximação é suficiente para começar.'
							}
						</Text>
					</View>
				</View>
			</ScrollView>

			<View style={styles.footer}>
				<Pressable
					onPress={handleNext}
					style={[primaryButtonStyles.buttonContainer, (isCurrentlySober ? !sobrietyStartDate : !lastDrinkDate) && { opacity: 0.5 }]}
					disabled={isCurrentlySober ? !sobrietyStartDate : !lastDrinkDate}
				>
					<Text style={primaryButtonStyles.buttonText}>Continuar</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}
