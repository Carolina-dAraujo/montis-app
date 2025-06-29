import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/mobile/constants/Colors';
import { ChevronLeft } from '@/mobile/components/icons/ChevronLeft';
import { NameInput, validateName } from '@/mobile/components/inputs/NameInput';
import { PhoneInput, validatePhone } from '@/mobile/components/inputs/PhoneInput';
import { EmailInput, validateEmail } from '@/mobile/components/inputs/EmailInput';
import { PasswordInput, validatePassword } from '@/mobile/components/inputs/PasswordInput';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditFieldScreen() {
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
	const inputRef = useRef<TextInput>(null);
	const router = useRouter();

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

	const handleSave = () => {
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

		// TODO: Handle saving the value

		Alert.alert(
			'Sucesso',
			alertMessages[field as keyof typeof alertMessages],
			[{
				text: 'OK',
				onPress: () => {
					if (field === 'password') {
						router.replace('/(config)/accountData');
					} else {
						router.back();
					}
				}
			}]
		);
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
				return <NameInput {...commonProps} />;
			case 'phone':
				return <PhoneInput {...commonProps} />;
			case 'email':
				return <EmailInput {...commonProps} />;
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
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<View style={styles.backIconContainer}>
						<ChevronLeft onPress={() => router.back()} />
					</View>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>{title}</Text>
					</View>
					<View style={styles.prontoButtonContainer}>
						<Pressable onPress={handleSave}>
							<Text style={styles.prontoButton}>Pronto</Text>
						</Pressable>
					</View>
				</View>
			</View>

			<View style={styles.content}>
				{description && <Text style={styles.description}>{description}</Text>}
				{renderInput()}
				{error && <Text style={styles.errorText}>{error}</Text>}
			</View>
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
		justifyContent: 'space-between',
		paddingRight: 20,
	},
	backIconContainer: {
		paddingTop: 8,
	},
	titleContainer: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 8,
	},
	title: {
		fontSize: 16,
		paddingLeft: 20,
		fontWeight: '500',
		color: Colors.light.text,
	},
	prontoButtonContainer: {
		paddingTop: 8,
	},
	prontoButton: {
		fontSize: 16,
		fontWeight: '500',
		color: Colors.containers.blue,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	description: {
		fontSize: 14,
		color: Colors.icon.gray,
		marginBottom: 16,
	},
	errorText: {
		color: '#FF3B30',
		fontSize: 12,
		marginTop: 4,
	},
});
