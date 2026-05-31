import { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Image, TouchableOpacity } from 'react-native';
import { Colors } from '@/shared/theme/colors';
import { useRouter } from 'expo-router';
import { ConfigHeader } from '@/features/settings/components/ConfigHeader';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as ImagePicker from 'expo-image-picker';
import { BottomSheet } from '@/shared/components/ui/BottomSheet';
import { fieldConfig } from '@/shared/config/fieldConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { useResolvedDisplayName } from '@/features/auth/hooks/useResolvedDisplayName';
import { useOnboarding } from '@/features/onboarding/context/OnboardingProvider';
import { resolveUserDisplayName } from '@/shared/lib/displayName';
import { authApi } from '@/features/auth/api';
import { storageService } from '@/shared/lib/storage';
import { styles } from '@/features/settings/styles/accountData.styles';

export default function AccountData() {
	const router = useRouter();
	const { user, logout, updateUser } = useAuth();
	const { onboardingData } = useOnboarding();
	const displayName = useResolvedDisplayName('');
	const nameLabel = displayName || 'Adicionar nome';
	const [profileImage, setProfileImage] = useState<string | null>(null);
	const [showMoreOptions, setShowMoreOptions] = useState(false);
	const scrollViewRef = useRef<ScrollView>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		fetchUserProfile();
	}, []);

	const fetchUserProfile = async () => {
		try {
			setIsLoading(true);

			const token = await storageService.getAuthToken();

			if (token) {
				const profile = await authApi.getProfile(token);
				const resolvedName = resolveUserDisplayName({
					displayName: profile.displayName,
					email: profile.email,
					onboardingDisplayName: onboardingData.displayName,
				});
				await updateUser({ ...profile, displayName: resolvedName });
			}
		} catch (error) {
			console.error('Error fetching profile:', error);
			Alert.alert('Erro', 'Não foi possível carregar os dados do perfil');
		} finally {
			setIsLoading(false);
		}
	};

	const pickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (status !== 'granted') {
			Alert.alert(
				'Permissão necessária',
				'Precisamos de permissão para acessar suas fotos.',
				[{ text: 'OK' }]
			);
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		});

		if (!result.canceled) {
			setProfileImage(result.assets[0].uri);
			Alert.alert('Sucesso', 'Imagem de perfil atualizada!');
		}
	};

	const handleDeleteAccount = () => {
		Alert.alert(
			'Apagar conta',
			'Tem certeza que deseja apagar sua conta? Esta ação não pode ser desfeita.',
			[
				{
					text: 'Cancelar',
					style: 'cancel',
				},
				{
					text: 'Apagar',
					style: 'destructive',
					onPress: async () => {
						try {
							const token = await storageService.getAuthToken();
							if (token) {
								await authApi.deleteAccount(token);
								await logout();
								router.replace('/(auth)/login');
							}
						} catch (error) {
							console.error('Error deleting account:', error);
							Alert.alert('Erro', 'Não foi possível apagar a conta');
						}
					},
				},
			],
		);
	};

	const handleLogout = () => {
		Alert.alert(
			'Sair',
			'Tem certeza que deseja sair?',
			[
				{
					text: 'Cancelar',
					style: 'cancel',
				},
				{
					text: 'Sair',
					style: 'destructive',
					onPress: async () => {
						await logout();
						router.replace('/(auth)/login');
					},
				},
			],
		);
	};

	const handleFieldPress = (field: string) => {
		const config = fieldConfig[field];
		if (!config) return;

		if (field === 'password') {
			router.push({
				pathname: '/(config)/confirm-password',
				params: {
					title: 'Confirme sua senha',
					placeholder: 'Digite sua senha atual'
				}
			});
			return;
		}

		router.push({
			pathname: '/(config)/edit-field',
			params: {
				field,
				value: field === 'name' ? nameLabel === 'Adicionar nome' ? '' : nameLabel :
					   field === 'phone' ? user?.phoneNumber || '' :
					   field === 'email' ? user?.email || '' : '',
				...config,
				secureTextEntry: config.secureTextEntry ? 'true' : 'false'
			},
		});
	};

	return (
		<SafeAreaView style={styles.container}>
			<ConfigHeader
				title="Dados da conta"
				onBack={() => router.back()}
				rightAction={(
					<Pressable
						style={styles.moreOptionsButton}
						onPress={() => setShowMoreOptions(!showMoreOptions)}
					>
						<FontAwesome6
							name="ellipsis-vertical"
							size={20}
							color={Colors.light.text}
						/>
					</Pressable>
				)}
			/>

			<BottomSheet
				visible={showMoreOptions}
				onClose={() => setShowMoreOptions(false)}
			>
				<Pressable
					style={styles.deleteSection}
					onPress={handleLogout}
				>
					<Text style={styles.deleteText}>Sair</Text>
				</Pressable>
				<View style={styles.separator} />
				<Pressable
					style={styles.deleteSection}
					onPress={handleDeleteAccount}
				>
					<Text style={styles.deleteText}>Apagar conta</Text>
				</Pressable>
			</BottomSheet>

			<ScrollView
				ref={scrollViewRef}
				style={styles.content}
				keyboardShouldPersistTaps="handled"
			>
				<View style={styles.profileSection}>
					<Pressable style={styles.profileImageContainer} onPress={pickImage}>
						{profileImage ? (
							<Image source={{ uri: profileImage }} style={styles.profileImage} />
						) : (
							<FontAwesome6 solid name="circle-user" size={120} color={Colors.black} />
						)}
						<View style={styles.editOverlay}>
							<FontAwesome6 name="camera" size={16} color={Colors.light.background} />
						</View>
					</Pressable>
					<Pressable style={styles.nameContainer} onPress={() => handleFieldPress('name')}>
						<Text style={styles.name}>{nameLabel}</Text>
						<FontAwesome6 name="edit" size={16} color={Colors.icon.gray} />
					</Pressable>
				</View>

				<View style={styles.formSection}>
					<View style={styles.fieldContainer}>
						<Text style={styles.fieldLabel}>Número de celular</Text>
						<Pressable
							style={styles.fieldButton}
							onPress={() => handleFieldPress('phone')}
						>
							<View>
								<Text style={styles.fieldValue}>{user?.phoneNumber || 'Adicionar telefone'}</Text>
							</View>
							<FontAwesome6 name="chevron-right" size={16} color={Colors.icon.gray} />
						</Pressable>
					</View>

					<View style={styles.fieldContainer}>
						<Text style={styles.fieldLabel}>Email</Text>
						<Pressable
							style={styles.fieldButton}
							onPress={() => handleFieldPress('email')}
						>
							<View>
								<Text style={styles.fieldValue}>{user?.email || 'seu@email.com'}</Text>
							</View>
							<FontAwesome6 name="chevron-right" size={16} color={Colors.icon.gray} />
						</Pressable>
					</View>

					<View style={styles.fieldContainer}>
						<Text style={styles.fieldLabel}>Senha</Text>
						<Pressable
							style={styles.fieldButton}
							onPress={() => handleFieldPress('password')}
						>
							<View>
								<Text style={styles.fieldValue}>••••••••</Text>
							</View>
							<FontAwesome6 name="chevron-right" size={16} color={Colors.icon.gray} />
						</Pressable>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
