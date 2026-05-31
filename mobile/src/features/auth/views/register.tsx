import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '@/shared/components/ui/PrimaryButton';
import { AuthScreenWrapper } from '@/shared/components/AuthScreenWrapper';
import { AuthInput } from '@/shared/components/ui/AuthInput';
import { GoogleLoginButton } from '@/shared/components/ui/GoogleLoginButton';
import { useRegisterForm } from '@/features/auth/hooks/useRegisterForm';
import { styles } from '@/features/auth/styles/authForm.styles';

export default function Register() {
	const router = useRouter();
	const {
		email,
		setEmail,
		senha,
		setSenha,
		errors,
		setErrors,
		isLoading,
		handleRegister,
	} = useRegisterForm();

	return (
		<AuthScreenWrapper title="Cadastro">
			<AuthInput
				label="EMAIL"
				placeholder=""
				value={email}
				onChangeText={(text) => {
					setEmail(text);
					setErrors((prev) => ({ ...prev, email: undefined }));
				}}
				error={errors.email}
			/>
			<AuthInput
				label="SENHA"
				placeholder=""
				value={senha}
				onChangeText={(text) => {
					setSenha(text);
					setErrors((prev) => ({ ...prev, password: undefined }));
				}}
				secureTextEntry
				error={errors.password}
			/>

			<PrimaryButton
				title={isLoading ? 'Cadastrando...' : 'Cadastrar'}
				onPress={handleRegister}
				disabled={isLoading}
			/>

			<TouchableOpacity onPress={() => router.push('/(auth)/login')}>
				<Text style={styles.linkText}>
					JÁ TEM UMA CONTA? <Text style={styles.linkBold}>FAZER LOGIN</Text>
				</Text>
			</TouchableOpacity>

			<View style={styles.separatorContainer}>
				<View style={styles.line} />
				<Text style={styles.separatorText}>ou</Text>
				<View style={styles.line} />
			</View>

			<GoogleLoginButton
				title="CADASTRAR COM O GOOGLE"
				onPress={() => console.log('Google signup')}
			/>
		</AuthScreenWrapper>
	);
}
