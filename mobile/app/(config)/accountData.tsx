import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Image } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';
import { ChevronLeft } from '@/mobile/components/icons/ChevronLeft';
import { useRouter } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef } from 'react';
import { PasswordInput } from '@/mobile/components/inputs/PasswordInput';
import { PhoneInput } from '@/mobile/components/inputs/PhoneInput';
import { EmailInput } from '@/mobile/components/inputs/EmailInput';

export default function AccountDataScreen() {
	const router = useRouter();
	const [profileImage, setProfileImage] = useState<string | null>(null);
	const [password, setPassword] = useState('');
	const [phone, setPhone] = useState('(00) 00000-0000');
	const [email, setEmail] = useState('joao@example.com');
	const [editingField, setEditingField] = useState<string | null>(null);
	const [hasChanges, setHasChanges] = useState(false);
	const [showMoreOptions, setShowMoreOptions] = useState(false);
	const scrollViewRef = useRef<ScrollView>(null);

	const userMock = {
		name: 'João da Silva',
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

	const toggleEditing = (field: string) => {
		setEditingField(editingField === field ? null : field);
		setShowMoreOptions(false);
	};

	const handleMoreOptionsPress = () => {
		setShowMoreOptions(!showMoreOptions);
		setEditingField(null);
	};

	const handleFieldChange = (field: string, value: string) => {
		setHasChanges(true);
		switch (field) {
			case 'phone':
				setPhone(value);
				break;
			case 'email':
				setEmail(value);
				break;
			case 'password':
				setPassword(value);
				break;
		}
	};

	const handleSaveChanges = () => {
		// TODO: Implement save changes to server
		setHasChanges(false);
		setEditingField(null);
	};

	const handleOutsidePress = () => {
		if (editingField) {
			setEditingField(null);
		}
		if (showMoreOptions) {
			setShowMoreOptions(false);
		}
	};

	return (
		<Pressable style={styles.container} onPress={handleOutsidePress}>
			<View style={styles.header}>
				<View style={styles.headerTop}>
					<View style={styles.backIconContainer}>
						<ChevronLeft onPress={() => router.back()} />
					</View>
				</View>
				<View style={styles.titleRow}>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Dados da conta</Text>
					</View>
					<Pressable
						style={styles.moreOptionsButton}
						onPress={handleMoreOptionsPress}
					>
						<FontAwesome6
							name="ellipsis-vertical"
							size={20}
							color={Colors.light.text}
						/>
					</Pressable>
				</View>
			</View>

			{showMoreOptions && (
				<View style={styles.dropdownContainer}>
					<Pressable
						style={styles.deleteSection}
						onPress={handleDeleteAccount}
					>
						<Text style={styles.deleteText}>Apagar conta</Text>
					</Pressable>
				</View>
			)}

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
					<Text style={styles.name}>{userMock.name}</Text>
				</View>

				<View style={styles.formSection}>
					<PhoneInput
						value={phone}
						onChange={(value) => handleFieldChange('phone', value)}
						label="Número de celular"
						isEditing={editingField === 'phone'}
						onEdit={() => toggleEditing('phone')}
					/>

					<EmailInput
						value={email}
						onChange={(value) => handleFieldChange('email', value)}
						label="Email"
						isEditing={editingField === 'email'}
						onEdit={() => toggleEditing('email')}
					/>

					<PasswordInput
						value={password}
						onChange={(value) => handleFieldChange('password', value)}
						label="Senha"
						isEditing={editingField === 'password'}
						onEdit={() => toggleEditing('password')}
					/>
				</View>

				{hasChanges && (
					<Pressable
						style={styles.saveButton}
						onPress={handleSaveChanges}
					>
						<Text style={styles.saveButtonText}>Salvar alterações</Text>
					</Pressable>
				)}
			</ScrollView>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	header: {
		paddingBottom: 28,
		flexDirection: 'column',
		alignItems: 'flex-start',
		gap: 12,
	},
	headerTop: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		paddingHorizontal: 20,
	},
	titleRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		paddingHorizontal: 20,
	},
	backIconContainer: {
		paddingTop: 8,
	},
	titleContainer: {
		flex: 1,
	},
	moreOptionsButton: {
		padding: 8,
		marginLeft: 8,
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
	name: {
		fontSize: 18,
		color: Colors.light.text,
		fontWeight: '500',
	},
	formSection: {
		gap: 24,
	},
	dropdownContainer: {
		position: 'absolute',
		top: 100,
		right: 20,
		backgroundColor: Colors.light.background,
		borderRadius: 8,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		zIndex: 1000,
		minWidth: 160,
	},
	deleteSection: {
		paddingVertical: 12,
		paddingHorizontal: 16,
	},
	deleteText: {
		fontSize: 14,
		color: Colors.black,
		fontWeight: '500',
	},
});