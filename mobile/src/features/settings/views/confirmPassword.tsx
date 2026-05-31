import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { PasswordInput } from '@/shared/components/inputs/PasswordInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConfigHeader } from '@/features/settings/components/ConfigHeader';
import { configLayoutStyles } from '@/features/settings/styles/configLayout.styles';
import { styles } from '@/features/settings/styles/confirmPassword.styles';

export default function ConfirmPassword() {
	const router = useRouter();
	const [currentPassword, setCurrentPassword] = useState('');
	const [error, setError] = useState<string | null>(null);

	const handleConfirm = () => {
		if (currentPassword) {
			router.push({
				pathname: '/(config)/edit-field',
				params: {
					field: 'password',
					value: '',
					title: 'Alterar senha',
					placeholder: 'Nova senha',
					secureTextEntry: 'true',
				},
			});
		} else {
			setError('Por favor, digite sua senha atual');
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<ConfigHeader
				title="Confirme sua senha"
				onBack={() => router.back()}
				titleAlign="center"
				rightAction={(
					<Pressable onPress={handleConfirm}>
						<Text style={configLayoutStyles.prontoButton}>Pronto</Text>
					</Pressable>
				)}
			/>

			<View style={styles.content}>
				<Text style={styles.description}>
					Por favor, digite sua senha atual para continuar
				</Text>
				<PasswordInput
					value={currentPassword}
					onChangeText={setCurrentPassword}
					error={error}
					placeholder="Digite sua senha atual"
				/>
			</View>
		</SafeAreaView>
	);
}
