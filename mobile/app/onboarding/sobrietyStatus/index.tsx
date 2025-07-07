import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/mobile/constants/Colors';
import { ChevronLeft } from 'lucide-react-native';
import { useOnboarding } from '@/mobile/contexts/OnboardingContext';
import { styles as welcomeButtonStyles } from 'app/onboarding/welcome/_styles';
import { styles } from './_styles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { statusOptions, type SobrietyStatus } from './_constants';

export default function SobrietyStatusScreen() {
	const router = useRouter();
	const { onboardingData, updateOnboardingData } = useOnboarding();
	const [selectedStatus, setSelectedStatus] = useState<SobrietyStatus>(onboardingData?.isCurrentlySober ? 'sober' : 'not_sober');

	const handleNext = () => {
		if (!selectedStatus) return;

		updateOnboardingData({
			isCurrentlySober: selectedStatus === 'sober'
		});

		router.push('/onboarding/sobrietyTimeline');
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
						<Text style={styles.title}>Você está sóbrio atualmente?</Text>
					</View>
				</View>
				<Text style={styles.subtitle}>
					Isso nos ajudará a personalizar sua experiência
				</Text>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.options}>
					{statusOptions.map((option) => (
						<Pressable
							key={option.id}
							style={[
								styles.option,
								selectedStatus === option.id && styles.optionSelected,
							]}
							onPress={() => setSelectedStatus(option.id)}
						>
							<View style={[
								styles.iconContainer,
								selectedStatus === option.id && styles.iconContainerSelected
							]}>
								<MaterialCommunityIcons
									name={option.icon}
									size={24}
									color={selectedStatus === option.id ? '#FFFFFF' : Colors.icon.gray}
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
					style={[welcomeButtonStyles.buttonContainer, !selectedStatus && { opacity: 0.5 }]}
					disabled={!selectedStatus}
				>
					<Text style={welcomeButtonStyles.buttonText}>Continuar</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}
