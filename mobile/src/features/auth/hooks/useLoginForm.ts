import { useState, useCallback } from 'react';
import { Alert, GestureResponderEvent } from 'react-native';
import { useAuth } from '@/features/auth/context/AuthProvider';

function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function useLoginForm() {
	const { login, isLoading } = useAuth();
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleLogin = useCallback(async (event: GestureResponderEvent) => {
		event.preventDefault();

		if (isSubmitting || isLoading) {
			return;
		}

		setErrors({});
		setIsSubmitting(true);

		try {
			const trimmedEmail = email.trim();
			const trimmedPassword = senha.trim();

			if (!trimmedEmail) {
				setErrors({ email: 'Email é obrigatório' });
				return;
			}

			if (!validateEmail(trimmedEmail)) {
				setErrors({ email: 'Digite um email válido' });
				return;
			}

			if (!trimmedPassword) {
				setErrors({ password: 'Senha é obrigatória' });
				return;
			}

			if (trimmedPassword.length < 8) {
				setErrors({ password: 'Senha deve ter pelo menos 8 caracteres' });
				return;
			}

			await login(trimmedEmail, trimmedPassword);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : '';

			if (
				message.includes('Email ou senha incorretos') ||
				message.includes('Invalid email or password')
			) {
				Alert.alert(
					'Erro no Login',
					'Email ou senha incorretos. Verifique suas credenciais.',
					[
						{
							text: 'Esqueci a Senha',
							onPress: () => {
								console.log('Forgot password');
							},
						},
						{ text: 'OK', style: 'cancel' },
					]
				);
			} else if (
				message.includes('Network request failed') ||
				message.includes('Não foi possível conectar')
			) {
				Alert.alert(
					'Erro de Conexão',
					'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
					[{ text: 'OK' }]
				);
			} else {
				Alert.alert('Erro', 'Erro ao fazer login. Tente novamente.', [{ text: 'OK' }]);
			}
		} finally {
			setIsSubmitting(false);
		}
	}, [email, senha, isSubmitting, isLoading, login]);

	return {
		email,
		setEmail,
		senha,
		setSenha,
		errors,
		setErrors,
		isSubmitting,
		isLoading,
		handleLogin,
	};
}
