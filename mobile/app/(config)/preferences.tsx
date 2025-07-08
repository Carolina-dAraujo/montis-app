import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, Pressable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/mobile/constants/Colors';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { NotificationFrequency } from '@/mobile/contexts/OnboardingContext';
import { usePreferences } from '@/mobile/hooks/usePreferences';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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

export default function PreferencesScreen() {
	const router = useRouter();
	const { preferences, updatePreferences, isLoading } = usePreferences();
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
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<View style={styles.backIconContainer}>
						<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
					<ChevronLeft size={24} color={Colors.icon.gray} />
				</TouchableOpacity>
					</View>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Preferências</Text>
					</View>
				</View>
			</View>

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
								<Text style={styles.preferenceTitle}>Lembretes Diários</Text>
								<Text style={styles.preferenceDescription}>
									Receba lembretes para fazer seu registro diário
								</Text>
							</View>
						</View>
						<Switch
							value={preferences.dailyReminders}
							onValueChange={handleDailyRemindersToggle}
							trackColor={{ false: Colors.input, true: Colors.containers.blue }}
							thumbColor={Colors.light.background}
						/>
					</View>

					<View style={[
						styles.frequencyCard,
						!preferences.dailyReminders && styles.disabledItem
					]}>
						<View style={styles.frequencyCardHeader}>
							<View style={[
								styles.iconContainer,
								!preferences.dailyReminders && styles.disabledIcon
							]}>
								<MaterialCommunityIcons
									name="clock-outline"
									size={24}
									color={!preferences.dailyReminders ? Colors.icon.gray : Colors.containers.blue}
								/>
							</View>
							<View style={styles.frequencyCardText}>
								<Text style={[
									styles.preferenceTitle,
									!preferences.dailyReminders && styles.disabledText
								]}>Frequência dos Lembretes</Text>
								<Text style={[
									styles.preferenceDescription,
									!preferences.dailyReminders && styles.disabledText
								]}>
									Escolha com que frequência receber lembretes
								</Text>
							</View>
						</View>
						<Pressable
							style={[
								styles.frequencyCardButton,
								!preferences.dailyReminders && styles.disabledButton
							]}
							onPress={() => preferences.dailyReminders && setShowFrequencySelector(!showFrequencySelector)}
							disabled={!preferences.dailyReminders}
						>
							<Text style={[
								styles.frequencyCardButtonText,
								!preferences.dailyReminders && styles.disabledText
							]}>
								{getFrequencyTitle(preferences.notificationFrequency)}
							</Text>
							<MaterialCommunityIcons
								name={showFrequencySelector ? "chevron-up" : "chevron-down"}
								size={20}
								color={!preferences.dailyReminders ? Colors.icon.gray : Colors.icon.gray}
							/>
						</Pressable>
					</View>

					{showFrequencySelector && preferences.dailyReminders && (
						<View style={styles.frequencySelector}>
							{notificationOptions.map((option) => (
								<Pressable
									key={option.id}
									style={[
										styles.frequencyOption,
										preferences.notificationFrequency === option.id && styles.frequencyOptionSelected,
									]}
									onPress={() => handleNotificationFrequencyChange(option.id)}
								>
									<Text style={[
										styles.frequencyOptionTitle,
										preferences.notificationFrequency === option.id && styles.frequencyOptionTitleSelected,
									]}>
										{option.title}
									</Text>
									<Text style={[
										styles.frequencyOptionDescription,
										preferences.notificationFrequency === option.id && styles.frequencyOptionDescriptionSelected,
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
								<Text style={styles.preferenceTitle}>Suporte em Crise</Text>
								<Text style={styles.preferenceDescription}>
									Receba notificações de suporte quando necessário
								</Text>
							</View>
						</View>
						<Switch
							value={preferences.crisisSupport}
							onValueChange={handleCrisisSupportToggle}
							trackColor={{ false: Colors.input, true: Colors.containers.blue }}
							thumbColor={Colors.light.background}
						/>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Privacity</Text>

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
								<Text style={styles.preferenceTitle}>Compartilhar Progresso</Text>
								<Text style={styles.preferenceDescription}>
									Permitir que outros vejam seu progresso
								</Text>
							</View>
						</View>
						<Switch
							value={preferences.shareProgress}
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	header: {
		paddingBottom: 28,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	backIconContainer: {
		paddingTop: 8,
	},
	backButton: {
		padding: 8,
	},
	titleContainer: {
		paddingTop: 8,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: Colors.light.text,
	},
	section: {
		marginBottom: 32,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.light.text,
		marginBottom: 16,
	},
	preferenceItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 16,
		paddingHorizontal: 16,
		backgroundColor: Colors.light.background,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.input,
		marginBottom: 12,
	},
	preferenceInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.lightGray,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	textContainer: {
		flex: 1,
		marginRight: 12,
	},
	preferenceTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 4,
	},
	preferenceDescription: {
		fontSize: 14,
		color: Colors.icon.gray,
		lineHeight: 20,
	},
	frequencyButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		backgroundColor: Colors.lightGray,
		borderWidth: 1,
		borderColor: Colors.input,
		minWidth: 100,
		maxWidth: 140,
	},
	frequencyButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: Colors.light.text,
		flex: 1,
		textAlign: 'center',
	},
	frequencySelector: {
		marginTop: 8,
		padding: 12,
		backgroundColor: Colors.lightGray,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.input,
	},
	frequencyOption: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		marginBottom: 8,
	},
	frequencyOptionSelected: {
		backgroundColor: Colors.containers.blue,
	},
	frequencyOptionTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 2,
	},
	frequencyOptionTitleSelected: {
		color: Colors.light.background,
	},
	frequencyOptionDescription: {
		fontSize: 12,
		color: Colors.icon.gray,
	},
	frequencyOptionDescriptionSelected: {
		color: Colors.light.background,
	},
	disabledItem: {
		opacity: 0.6,
	},
	disabledIcon: {
		backgroundColor: Colors.lightGray,
	},
	disabledText: {
		color: Colors.icon.gray,
	},
	disabledButton: {
		backgroundColor: Colors.lightGray,
		borderColor: Colors.icon.gray,
	},
	frequencyCard: {
		backgroundColor: Colors.light.background,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.input,
		marginBottom: 12,
		overflow: 'hidden',
	},
	frequencyCardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 16,
		paddingHorizontal: 16,
	},
	frequencyCardText: {
		flex: 1,
		marginLeft: 12,
	},
	frequencyCardButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 16,
		paddingHorizontal: 16,
		backgroundColor: Colors.lightGray,
		borderTopWidth: 1,
		borderTopColor: Colors.input,
	},
	frequencyCardButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.light.text,
	},
}); 