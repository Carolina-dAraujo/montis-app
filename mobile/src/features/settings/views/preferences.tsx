import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, Alert, Pressable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/shared/theme/colors';
import { useRouter } from 'expo-router';
import { ConfigHeader } from '@/features/settings/components/ConfigHeader';
import { NotificationFrequency } from '@/features/onboarding/context/OnboardingProvider';
import { usePreferences } from '@/features/settings/hooks/usePreferences';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { styles } from '@/features/settings/styles/preferences.styles';

const notificationOptions = [
	{
		id: NotificationFrequency.DAILY,
		title: 'Diariamente',
		description: 'Receber lembretes todos os dias',
	},
	{
		id: NotificationFrequency.WEEKLY,
		title: 'Semanalmente',
		description: 'Receber lembretes uma vez por semana',
	},
	{
		id: NotificationFrequency.MONTHLY,
		title: 'Mensalmente',
		description: 'Receber lembretes uma vez por mês',
	},
	{
		id: NotificationFrequency.NEVER,
		title: 'Nunca',
		description: 'Não receber lembretes',
	},
];

export default function Preferences() {
	const router = useRouter();
	const { preferences: userPreferences, updatePreferences, isLoading } = usePreferences();
	const [showFrequencySelector, setShowFrequencySelector] = useState(false);

	const handleDailyRemindersToggle = async (value: boolean) => {
		await updatePreferences({ dailyReminders: value });

		if (!value) {
			setShowFrequencySelector(false);
		}
	};

	const handleNotificationFrequencyChange = async (frequency: NotificationFrequency) => {
		await updatePreferences({ notificationFrequency: frequency });
		setShowFrequencySelector(false);
	};

	const handleCrisisSupportToggle = async (value: boolean) => {
		await updatePreferences({ crisisSupport: value });
	};

	const handleShareProgressToggle = async (value: boolean) => {
		await updatePreferences({ shareProgress: value });
	};

	const getFrequencyTitle = (frequency: NotificationFrequency) => {
		const option = notificationOptions.find(opt => opt.id === frequency);
		return option?.title || 'Diariamente';
	};

	return (
		<SafeAreaView style={styles.container}>
			<ConfigHeader title="Preferências" onBack={() => router.back()} />

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Notificações</Text>

					<View style={styles.preferenceItem}>
						<View style={styles.preferenceInfo}>
							<View style={styles.iconContainer}>
								<MaterialCommunityIcons
									name="bell-outline"
									size={24}
									color={Colors.containers.blue}
								/>
							</View>
							<View style={styles.textContainer}>
								<Text style={styles.preferenceTitle}>Lembretes diários</Text>
								<Text style={styles.preferenceDescription}>
									Receba lembretes para fazer seu registro diário
								</Text>
							</View>
						</View>
						<Switch
							value={userPreferences.dailyReminders}
							onValueChange={handleDailyRemindersToggle}
							trackColor={{ false: Colors.input, true: Colors.containers.blue }}
							thumbColor={Colors.light.background}
						/>
					</View>

					<View style={[
						styles.frequencyCard,
						!userPreferences.dailyReminders && styles.disabledItem
					]}>
						<View style={styles.frequencyCardHeader}>
							<View style={[
								styles.iconContainer,
								!userPreferences.dailyReminders && styles.disabledIcon
							]}>
								<MaterialCommunityIcons
									name="clock-outline"
									size={24}
									color={!userPreferences.dailyReminders ? Colors.icon.gray : Colors.containers.blue}
								/>
							</View>
							<View style={styles.frequencyCardText}>
								<Text style={[
									styles.preferenceTitle,
									!userPreferences.dailyReminders && styles.disabledText
								]}>Frequência dos lembretes</Text>
								<Text style={[
									styles.preferenceDescription,
									!userPreferences.dailyReminders && styles.disabledText
								]}>
									Escolha com que frequência receber lembretes
								</Text>
							</View>
						</View>
						<Pressable
							style={[
								styles.frequencyCardButton,
								!userPreferences.dailyReminders && styles.disabledButton
							]}
							onPress={() => userPreferences.dailyReminders && setShowFrequencySelector(!showFrequencySelector)}
							disabled={!userPreferences.dailyReminders}
						>
							<Text style={[
								styles.frequencyCardButtonText,
								!userPreferences.dailyReminders && styles.disabledText
							]}>
								{getFrequencyTitle(userPreferences.notificationFrequency)}
							</Text>
							<MaterialCommunityIcons
								name={showFrequencySelector ? "chevron-up" : "chevron-down"}
								size={20}
								color={!userPreferences.dailyReminders ? Colors.icon.gray : Colors.icon.gray}
							/>
						</Pressable>
					</View>

					{showFrequencySelector && userPreferences.dailyReminders && (
						<View style={styles.frequencySelector}>
							{notificationOptions.map((option) => (
								<Pressable
									key={option.id}
									style={[
										styles.frequencyOption,
										userPreferences.notificationFrequency === option.id && styles.frequencyOptionSelected,
									]}
									onPress={() => handleNotificationFrequencyChange(option.id)}
								>
									<Text style={[
										styles.frequencyOptionTitle,
										userPreferences.notificationFrequency === option.id && styles.frequencyOptionTitleSelected,
									]}>
										{option.title}
									</Text>
									<Text style={[
										styles.frequencyOptionDescription,
										userPreferences.notificationFrequency === option.id && styles.frequencyOptionDescriptionSelected,
									]}>
										{option.description}
									</Text>
								</Pressable>
							))}
						</View>
					)}
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Suporte</Text>

					<View style={styles.preferenceItem}>
						<View style={styles.preferenceInfo}>
							<View style={styles.iconContainer}>
								<MaterialCommunityIcons
									name="shield-alert-outline"
									size={24}
									color={Colors.containers.blue}
								/>
							</View>
							<View style={styles.textContainer}>
								<Text style={styles.preferenceTitle}>Suporte em crise</Text>
								<Text style={styles.preferenceDescription}>
									Receba notificações de suporte quando necessário
								</Text>
							</View>
						</View>
						<Switch
							value={userPreferences.crisisSupport}
							onValueChange={handleCrisisSupportToggle}
							trackColor={{ false: Colors.input, true: Colors.containers.blue }}
							thumbColor={Colors.light.background}
						/>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Privacidade</Text>

					<View style={styles.preferenceItem}>
						<View style={styles.preferenceInfo}>
							<View style={styles.iconContainer}>
								<MaterialCommunityIcons
									name="share-variant-outline"
									size={24}
									color={Colors.containers.blue}
								/>
							</View>
							<View style={styles.textContainer}>
								<Text style={styles.preferenceTitle}>Compartilhar progresso</Text>
								<Text style={styles.preferenceDescription}>
									Permitir que outros vejam seu progresso
								</Text>
							</View>
						</View>
						<Switch
							value={userPreferences.shareProgress}
							onValueChange={handleShareProgressToggle}
							trackColor={{ false: Colors.input, true: Colors.containers.blue }}
							thumbColor={Colors.light.background}
						/>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
