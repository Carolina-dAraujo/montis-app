import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '@/shared/components/ui/PrimaryButton';
import { AuthScreenWrapper } from '@/shared/components/AuthScreenWrapper';
import { AuthInput } from '@/shared/components/ui/AuthInput';
import { GoogleLoginButton } from '@/shared/components/ui/GoogleLoginButton';
import { useLoginForm } from '@/features/auth/hooks/useLoginForm';
import { styles } from '@/features/auth/styles/authForm.styles';

export default function Login() {
	const router = useRouter();
	const {
		email,
		setEmail,
		senha,
		setSenha,
		errors,
		setErrors,
		isSubmitting,
		isLoading,
		handleLogin,
	} = useLoginForm();

	return (
		<AuthScreenWrapper title="Login">
			<AuthInput
				label="EMAIL"
				placeholder="Digite seu email"
				value={email}
				onChangeText={(text) => {
					setEmail(text);
					setErrors((prev) => ({ ...prev, email: undefined }));
				}}
				error={errors.email}
				keyboardType="email-address"
				autoCapitalize="none"
				autoCorrect={false}
			/>

			<AuthInput
				label="SENHA"
				placeholder="Digite sua senha"
				value={senha}
				onChangeText={(text) => {
					setSenha(text);
					setErrors((prev) => ({ ...prev, password: undefined }));
				}}
				secureTextEntry
				error={errors.password}
				autoCapitalize="none"
				autoCorrect={false}
			/>

			<TouchableOpacity style={styles.forgotPassword}>
				<Text style={styles.forgotPasswordText}>ESQUECEU SUA SENHA?</Text>
			</TouchableOpacity>

			<PrimaryButton
				title={isSubmitting || isLoading ? 'Entrando...' : 'Login'}
				onPress={handleLogin}
				disabled={isSubmitting || isLoading}
			/>

			<TouchableOpacity onPress={() => router.push('/(auth)/register')}>
				<Text style={styles.linkText}>
					AINDA NÃO TEM UMA CONTA? <Text style={styles.linkBold}>CADASTRE-SE</Text>
				</Text>
			</TouchableOpacity>

			<View style={styles.separatorContainer}>
				<View style={styles.line} />
				<Text style={styles.separatorText}>ou</Text>
				<View style={styles.line} />
			</View>

			<GoogleLoginButton title="ENTRAR COM O GOOGLE" onPress={() => console.log('Google login')} />
		</AuthScreenWrapper>
	);
}
