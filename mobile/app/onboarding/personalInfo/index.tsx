import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './_styles';
import { NameInput, validateName } from '@/mobile/components/inputs/NameInput';
import { PhoneInput, validatePhone } from '@/mobile/components/inputs/PhoneInput';
import { CustomDateInput } from '@/mobile/components/inputs/CustomDateInput';
import { ChevronLeft } from '@/mobile/components/icons/ChevronLeft';
import { useOnboarding } from '@/mobile/contexts/OnboardingContext';
import { useAuth } from '@/mobile/contexts/AuthContext';
import { styles as welcomeButtonStyles } from '../welcome/_styles';

export default function PersonalInfoScreen() {
	const router = useRouter();
	const { onboardingData, updateOnboardingData } = useOnboarding();
	const { updateUserFromOnboarding } = useAuth();
	const [name, setName] = useState(onboardingData.displayName || '');
	const [phone, setPhone] = useState(onboardingData.phone || '');
	const [birthDate, setBirthDate] = useState<Date | null>(
		onboardingData.birthDate ? new Date(onboardingData.birthDate) : null
	);
	const [errors, setErrors] = useState<{ name?: string; phone?: string; birthDate?: string }>({});

	const handleNext = () => {
		const nameValidation = validateName(name);
		const phoneValidation = phone ? validatePhone(phone) : { isValid: true };
		const birthDateValidation = birthDate ? { isValid: true } : { isValid: false, error: 'Data de nascimento é obrigatória' };

		if (!nameValidation.isValid) {
			setErrors({ name: nameValidation.error });
			return;
		}

		if (!phoneValidation.isValid) {
			setErrors({ phone: phoneValidation.error });
			return;
		}

		if (!birthDateValidation.isValid) {
			setErrors({ birthDate: birthDateValidation.error });
			return;
		}

		const userData = {
			displayName: name,
			phone: phone || undefined,
			birthDate: birthDate?.toISOString(),
		};

		updateOnboardingData(userData);
		updateUserFromOnboarding(userData);

		router.push('/onboarding/sobrietyStatus');
	};

	const handleBack = () => {
		router.back();
	};

	const handleBirthDateChange = (date: Date) => {
		setBirthDate(date);
		setErrors(prev => ({ ...prev, birthDate: undefined }));
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<View style={styles.backIconContainer}>
						<ChevronLeft onPress={handleBack} />
					</View>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Informações pessoais</Text>
					</View>
                    <View style={styles.prontoButtonContainer}></View>
				</View>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nome completo</Text>
                        <NameInput
                            value={name}
                            onChangeText={(text) => {
                                setName(text);
                                setErrors(prev => ({ ...prev, name: undefined }));
                            }}
                            error={errors.name}
                            placeholder="Seu nome completo"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Número de celular</Text>
                        <PhoneInput
                            value={phone}
                            onChangeText={(text) => {
                                setPhone(text);
                                setErrors(prev => ({ ...prev, phone: undefined }));
                            }}
                            error={errors.phone}
                            placeholder="(00) 00000-0000"
                        />
                    </View>

					<View style={styles.inputContainer}>
						<CustomDateInput
							value={birthDate}
							onChange={handleBirthDateChange}
							label="Data de nascimento"
							placeholder="Selecione sua data de nascimento"
							error={errors.birthDate}
							maximumDate={new Date()}
							minimumDate={new Date(1900, 0, 1)}
						/>
					</View>
				</View>
			</ScrollView>

			<View style={styles.footer}>
				<Pressable
					onPress={handleNext}
					style={[welcomeButtonStyles.buttonContainer, (!name.trim() || !birthDate) && { opacity: 0.5 }]}
					disabled={!name.trim() || !birthDate}
				>
					<Text style={welcomeButtonStyles.buttonText}>Continuar</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}
