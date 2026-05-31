import { useState, useCallback } from 'react';
import { Alert, GestureResponderEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { useOnboarding } from '@/features/onboarding/context/OnboardingProvider';
import { validatePassword } from '@/shared/components/inputs/PasswordInput';

export function useRegisterForm() {
	const router = useRouter();
	const { register, isLoading } = useAuth();
	const { clearOnboardingData } = useOnboarding();
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

	const handleRegister = useCallback(async (event: GestureResponderEvent) => {
		event.preventDefault();
		setErrors({});

		try {
			clearOnboardingData();

			const passwordValidation = validatePassword(senha);
			if (!passwordValidation.isValid) {
				setErrors({ password: passwordValidation.error });
				return;
			}

			if (!email.trim()) {
				setErrors({ email: 'Email não pode estar vazio' });
				return;
			}

			await register(email.trim(), senha);

			Alert.alert('Sucesso!', 'Conta criada com sucesso!', [{ text: 'OK' }]);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : '';

			if (message.includes('Email inválido')) {
				setErrors({ email: 'Email inválido' });
			} else if (message.includes('Senha muito fraca')) {
				setErrors({ password: 'Senha muito fraca' });
			} else if (message.includes('Não foi possível criar a conta')) {
				Alert.alert(
					'Erro no Cadastro',
					'Não foi possível criar a conta. Verifique os dados e tente novamente.',
					[
						{
							text: 'Tentar Login',
							onPress: () => router.push('/(auth)/login'),
						},
						{ text: 'OK', style: 'cancel' },
					]
				);
			} else {
				Alert.alert('Erro', 'Erro ao registrar usuário. Tente novamente.', [{ text: 'OK' }]);
			}
		}
	}, [clearOnboardingData, email, senha, register, router]);

	return {
		email,
		setEmail,
		senha,
		setSenha,
		errors,
		setErrors,
		isLoading,
		handleRegister,
	};
}
