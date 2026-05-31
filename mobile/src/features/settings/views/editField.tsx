import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { NameInput, validateName } from '@/shared/components/inputs/NameInput';
import { PhoneInput, validatePhone } from '@/shared/components/inputs/PhoneInput';
import { EmailInput, validateEmail } from '@/shared/components/inputs/EmailInput';
import { PasswordInput, validatePassword } from '@/shared/components/inputs/PasswordInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '@/services/api';
import { storageService } from '@/shared/lib/storage';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { ConfigHeader } from '@/features/settings/components/ConfigHeader';
import { configLayoutStyles } from '@/features/settings/styles/configLayout.styles';
import { styles } from '@/features/settings/styles/editField.styles';

export default function EditField() {
	const { field, value, title, description, placeholder } = useLocalSearchParams<{
		field: string;
		value: string;
		title: string;
		description: string;
		placeholder: string;
	}>();
	const [inputValue, setInputValue] = useState(value);
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const inputRef = useRef<TextInput>(null);
	const router = useRouter();
	const { updateUser } = useAuth();

	const alertMessages = {
		name: 'Nome atualizado com sucesso!',
		phone: 'Número de celular atualizado com sucesso!',
		email: 'Email atualizado com sucesso!',
		password: 'Senha atualizada com sucesso!',
	};

	useEffect(() => {
		setTimeout(() => {
			inputRef.current?.focus();
		}, 50);
	}, []);

	const handleInputChange = (text: string) => {
		setInputValue(text);
		setError(null);
	};

	const handleSave = async () => {
		try {
			setIsLoading(true);
			
			let validation;
			switch (field) {
				case 'name':
					validation = validateName(inputValue);
					break;
				case 'phone':
					validation = validatePhone(inputValue);
					break;
				case 'email':
					validation = validateEmail(inputValue);
					break;
				case 'password':
					validation = validatePassword(inputValue, confirmPassword);
					break;
				default:
					validation = { isValid: true };
			}

			if (!validation.isValid) {
				setError(validation.error || null);
				Alert.alert(
					'Erro de validação',
					validation.error || 'Por favor, corrija os erros antes de salvar.',
					[{ text: 'OK' }]
				);
				return;
			}

			const token = await storageService.getAuthToken();
			if (!token) {
				throw new Error('Token não encontrado');
			}

			if (field === 'password') {
				// For password, we need current password from confirmPassword field
				await apiService.updatePassword(token, {
					currentPassword: confirmPassword,
					newPassword: inputValue,
				});
			} else {
				// For other fields, update profile
				const updateData: any = {};
				if (field === 'name') updateData.displayName = inputValue;
				if (field === 'phone') updateData.phone = inputValue;
				if (field === 'email') updateData.email = inputValue;

				const updatedProfile = await apiService.updateProfile(token, updateData);
				await updateUser(updatedProfile);
			}

			Alert.alert(
				'Sucesso',
				alertMessages[field as keyof typeof alertMessages],
				[{
					text: 'OK',
					onPress: () => {
						if (field === 'password') {
							router.replace('/(config)/account-data');
						} else {
							router.back();
						}
					}
				}]
			);
		} catch (error: any) {
			console.error('Error saving field:', error);
			Alert.alert(
				'Erro',
				error.message || 'Não foi possível salvar as alterações',
				[{ text: 'OK' }]
			);
		} finally {
			setIsLoading(false);
		}
	};

	const renderInput = () => {
		const commonProps = {
			value: inputValue,
			onChangeText: handleInputChange,
			error,
			placeholder,
		};

		switch (field) {
			case 'name':
				return <NameInput {...commonProps} ref={inputRef} />;
			case 'phone':
				return <PhoneInput {...commonProps} ref={inputRef} />;
			case 'email':
				return <EmailInput {...commonProps} ref={inputRef} />;
			case 'password':
				return (
					<PasswordInput
						{...commonProps}
						confirmValue={confirmPassword}
						onConfirmChange={(text) => {
							setConfirmPassword(text);
							setError(null);
						}}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<ConfigHeader
				title={title}
				onBack={() => router.back()}
				titleAlign="center"
				rightAction={(
					<Pressable onPress={handleSave} disabled={isLoading}>
						<Text style={[configLayoutStyles.prontoButton, isLoading && configLayoutStyles.prontoButtonDisabled]}>
							{isLoading ? 'Salvando...' : 'Pronto'}
						</Text>
					</Pressable>
				)}
			/>

			<View style={styles.content}>
				{description && <Text style={styles.description}>{description}</Text>}
				{renderInput()}
				{error && <Text style={styles.errorText}>{error}</Text>}
			</View>
		</SafeAreaView>
	);
}
