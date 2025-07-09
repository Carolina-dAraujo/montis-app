import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './_styles';
import { NameInput, validateName } from '@/mobile/components/inputs/NameInput';
import { PhoneInput, validatePhone } from '@/mobile/components/inputs/PhoneInput';
import { CustomDateInput } from '@/mobile/components/inputs/CustomDateInput';
import { ChevronLeft } from 'lucide-react-native';
import { useOnboarding } from '@/mobile/contexts/OnboardingContext';
import { useAuth } from '@/mobile/contexts/AuthContext';
import { Colors } from '@/mobile/constants/Colors';
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
	const [address, setAddress] = useState(onboardingData.address || '');
	const [city, setCity] = useState(onboardingData.city || '');
	const [neighborhood, setNeighborhood] = useState(onboardingData.neighborhood || '');
	const [cep, setCep] = useState(onboardingData.cep || '');
	const [errors, setErrors] = useState<{ name?: string; phone?: string; birthDate?: string; address?: string; city?: string; neighborhood?: string }>({});

	// Garante que campos opcionais venham em branco ao iniciar o onboarding
	useEffect(() => {
		if (!onboardingData._initialized) {
			setPhone('');
			setBirthDate(null);
			setAddress('');
			setCity('');
			setNeighborhood('');
			setCep('');
			updateOnboardingData({
				phone: undefined,
				birthDate: undefined,
				address: undefined,
				city: undefined,
				neighborhood: undefined,
				cep: undefined,
				_initialized: true,
			});
		}
	}, []);

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
			address: address.trim() || undefined,
			city: city.trim() || undefined,
			neighborhood: neighborhood.trim() || undefined,
			cep: cep.trim() || undefined,
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
						<TouchableOpacity style={styles.backButton} onPress={handleBack}>
							<ChevronLeft size={24} color={Colors.icon.gray} />
						</TouchableOpacity>
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
						<Text style={styles.label}>
							Nome completo <Text style={{ color: 'red' }}>*</Text>
						</Text>
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
						<Text style={styles.label}>
							Número de celular <Text style={{ color: 'red' }}>*</Text>
						</Text>
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
						<Text style={styles.label}>
							Data de nascimento <Text style={{ color: 'red' }}>*</Text>
						</Text>
						<CustomDateInput
							value={birthDate}
							onChange={handleBirthDateChange}
							label=""
							placeholder="Selecione sua data de nascimento"
							error={errors.birthDate}
							maximumDate={new Date()}
							minimumDate={new Date(1900, 0, 1)}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Endereço</Text>
						<TextInput
							value={address}
							onChangeText={text => {
								setAddress(text);
								setErrors(prev => ({ ...prev, address: undefined }));
							}}
							style={[styles.input, errors.address && { borderColor: 'red' }]}
							placeholder="Rua, número"
							autoCapitalize="words"
						/>
						{errors.address && <Text style={{ color: 'red', fontSize: 12 }}>{errors.address}</Text>}
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Cidade</Text>
						<TextInput
							value={city}
							onChangeText={text => {
								setCity(text);
								setErrors(prev => ({ ...prev, city: undefined }));
							}}
							style={[styles.input, errors.city && { borderColor: 'red' }]}
							placeholder="Cidade"
							autoCapitalize="words"
						/>
						{errors.city && <Text style={{ color: 'red', fontSize: 12 }}>{errors.city}</Text>}
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Bairro</Text>
						<TextInput
							value={neighborhood}
							onChangeText={text => {
								setNeighborhood(text);
								setErrors(prev => ({ ...prev, neighborhood: undefined }));
							}}
							style={[styles.input, errors.neighborhood && { borderColor: 'red' }]}
							placeholder="Bairro"
							autoCapitalize="words"
						/>
						{errors.neighborhood && <Text style={{ color: 'red', fontSize: 12 }}>{errors.neighborhood}</Text>}
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>CEP</Text>
						<TextInput
							value={cep}
							onChangeText={text => {
								// Aplica máscara xxxxx-xxx
								let cleaned = text.replace(/\D/g, '');
								let masked = cleaned;
								if (cleaned.length > 5) {
									masked = cleaned.slice(0, 5) + '-' + cleaned.slice(5, 8);
								}
								setCep(masked);
							}}
							style={styles.input}
							placeholder="CEP"
							keyboardType="numeric"
							maxLength={9}
							autoCapitalize="none"
						/>
					</View>
					<View style={{ height: 40 }} />
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
