import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Image } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';
import { ChevronLeft } from '@/mobile/components/icons/ChevronLeft';
import { useRouter } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as ImagePicker from 'expo-image-picker';
import { BottomSheet } from '@/mobile/components/ui/BottomSheet';
import { fieldConfig } from '@/mobile/constants/fieldConfig';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountDataScreen() {
	const router = useRouter();
	const [profileImage, setProfileImage] = useState<string | null>(null);
	const [showMoreOptions, setShowMoreOptions] = useState(false);
	const scrollViewRef = useRef<ScrollView>(null);
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	useEffect(() => {
		fetchUserProfile();
	}, []);

	const fetchUserProfile = async () => {
		// TODO: Implement fetchUserProfile
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
			// TODO: Upload image to server
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
					onPress: () => {
						// TODO: Implement account deletion
						console.log('Account deletion requested');
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
					onPress: () => {
						// TODO: Implement logout
						router.replace('/login');
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
				pathname: '/confirmPassword',
				params: {
					title: 'Confirme sua senha',
					placeholder: 'Digite sua senha atual'
				}
			});
			return;
		}

		router.push({
			pathname: '/editField',
			params: {
				field,
				value: field === 'name' ? name :
					   field === 'phone' ? phone :
					   field === 'email' ? email : '',
				...config,
				secureTextEntry: config.secureTextEntry ? 'true' : 'false'
			},
		});
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<View style={styles.backIconContainer}>
						<ChevronLeft onPress={() => router.back()} />
					</View>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Dados da conta</Text>
					</View>
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
				</View>
			</View>

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
						<Text style={styles.name}>{name || 'João da Silva'}</Text>
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
								<Text style={styles.fieldValue}>{phone || '(00) 00000-0000'}</Text>
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
								<Text style={styles.fieldValue}>{email || 'seu@email.com'}</Text>
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
		gap: 12,
		paddingRight: 20,
	},
	backIconContainer: {
		paddingTop: 8,
	},
	titleContainer: {
		flex: 1,
		paddingTop: 8,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: Colors.light.text,
	},
	saveButton: {
		marginTop: 32,
		marginBottom: 16,
		backgroundColor: Colors.containers.blue,
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: 'center',
	},
	saveButtonText: {
		color: Colors.light.background,
		fontSize: 16,
		fontWeight: '500',
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	profileSection: {
		alignItems: 'center',
		marginBottom: 32,
	},
	profileImageContainer: {
		position: 'relative',
		marginBottom: 12,
	},
	profileImage: {
		width: 120,
		height: 120,
		borderRadius: 60,
	},
	editOverlay: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: Colors.black,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: Colors.light.background,
	},
	nameContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	name: {
		fontSize: 18,
		color: Colors.light.text,
		fontWeight: '500',
	},
	formSection: {
		gap: 24,
	},
	moreOptionsButton: {
		paddingTop: 8,
		paddingHorizontal: 8,
	},
	deleteSection: {
		paddingVertical: 16,
		paddingHorizontal: 20,
	},
	deleteText: {
		color: Colors.light.text,
		fontSize: 16,
		fontWeight: '500',
	},
	separator: {
		height: 1,
		backgroundColor: Colors.light.shadow,
		marginHorizontal: 20,
	},
	fieldButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: Colors.input,
		borderRadius: 12,
		padding: 16,
	},
	fieldLabel: {
		fontSize: 14,
		color: Colors.light.text,
		fontWeight: '500',
		marginBottom: 4,
	},
	fieldValue: {
		fontSize: 16,
		color: Colors.icon.gray,
	},
	fieldContainer: {
		gap: 8,
	},
});