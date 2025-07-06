import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';
import { ChevronLeft } from '@/mobile/components/icons/ChevronLeft';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { PasswordInput } from '@/mobile/components/inputs/PasswordInput';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConfirmPasswordScreen() {
	const router = useRouter();
	const params = useLocalSearchParams();
	const [currentPassword, setCurrentPassword] = useState('');
	const [error, setError] = useState<string | null>(null);

	const handleConfirm = async () => {
		// TODO: Implement password verification
		if (currentPassword) {
			router.push({
				pathname: '/editField',
				params: {
					field: 'password',
					value: '',
					title: 'Alterar senha',
					placeholder: 'Nova senha',
					secureTextEntry: 'true'
				}
			});
		} else {
			setError('Por favor, digite sua senha atual');
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
						<Text style={styles.title}>Confirme sua senha</Text>
					</View>
					<View style={styles.prontoButtonContainer}>
						<Pressable onPress={handleConfirm}>
							<Text style={styles.prontoButton}>Pronto</Text>
						</Pressable>
					</View>
				</View>
			</View>

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
}); 