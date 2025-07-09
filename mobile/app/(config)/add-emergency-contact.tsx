import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/mobile/constants/Colors';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ChevronLeft, User, Phone, Heart } from 'lucide-react-native';
import { useState } from 'react';
import { useEmergencyContacts } from '@/mobile/hooks/useEmergencyContacts';

interface NewContact {
    name: string;
    phone: string;
    relationship: string;
}

const AddEmergencyContactScreen = () => {
    const insets = useSafeAreaInsets();
    const { createContact } = useEmergencyContacts();
    const [contact, setContact] = useState<NewContact>({
        name: '',
        phone: '',
        relationship: ''
    });
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

	const formatPhoneNumber = (text: string) => {
		const cleaned = text.replace(/\D/g, '');

		if (cleaned.length === 0) {
			return '';
		}

		if (cleaned.length <= 2) {
			return `(${cleaned}`;
		} else if (cleaned.length <= 6) {
			return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
		} else if (cleaned.length <= 10) {
			return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
		} else {
			return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
		}
	};

	const handlePhoneChange = (text: string) => {
		const formatted = formatPhoneNumber(text);
		setContact({ ...contact, phone: formatted });
	};

	const handleSave = async () => {
		if (!contact.name.trim() || !contact.phone.trim() || !contact.relationship.trim()) {
			Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos.');
			return;
		}

		if (isSubmitting) return;

		try {
			setIsSubmitting(true);
			await createContact({
				name: contact.name.trim(),
				phone: contact.phone.trim(),
				relationship: contact.relationship.trim(),
				isActive: true
			});

			Alert.alert(
				'Contato salvo',
				'Contato de emergência adicionado com sucesso!',
				[
					{
						text: 'OK',
						onPress: () => router.back()
					}
				]
			);
		} catch (error) {
			Alert.alert('Erro', 'Não foi possível salvar o contato. Tente novamente.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		if (contact.name || contact.phone || contact.relationship) {
			Alert.alert(
				'Cancelar',
				'Tem certeza que deseja cancelar? As informações serão perdidas.',
				[
					{ text: 'Continuar editando', style: 'cancel' },
					{ text: 'Cancelar', style: 'destructive', onPress: () => router.back() }
				]
			);
		} else {
			router.back();
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<TouchableOpacity style={styles.backButton} onPress={handleCancel}>
						<ChevronLeft size={24} color={Colors.icon.gray} />
					</TouchableOpacity>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Adicionar contato</Text>
					</View>
					<View style={{ width: 24 }} />
				</View>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.heroSection}>
					<View style={styles.iconContainer}>
						<Ionicons name="people-circle" size={48} color={Colors.containers.blue} />
					</View>
					<Text style={styles.heroTitle}>Contato de Emergência</Text>
					<Text style={styles.heroSubtitle}>
						Adicione um contato que receberá alertas quando você enviar um sinal de emergência
					</Text>
				</View>

				<View style={styles.formSection}>
					<View style={styles.inputContainer}>
						<View style={styles.inputLabel}>
							<User size={16} color={Colors.light.icon} />
							<Text style={styles.labelText}>Nome completo</Text>
						</View>
						<TextInput
							style={[
								styles.input,
								focusedInput === 'name' && styles.inputFocused
							]}
							placeholder="Digite o nome completo"
							placeholderTextColor="#9CA3AF"
							value={contact.name}
							onChangeText={(text) => setContact({ ...contact, name: text })}
							onFocus={() => setFocusedInput('name')}
							onBlur={() => setFocusedInput(null)}
							autoCapitalize="words"
							autoComplete="name"
						/>
					</View>

					<View style={styles.inputContainer}>
						<View style={styles.inputLabel}>
							<Phone size={16} color={Colors.light.icon} />
							<Text style={styles.labelText}>Telefone</Text>
						</View>
						<TextInput
							style={[
								styles.input,
								focusedInput === 'phone' && styles.inputFocused
							]}
							placeholder="(11) 99999-9999"
							placeholderTextColor="#9CA3AF"
							value={contact.phone}
							onChangeText={handlePhoneChange}
							onFocus={() => setFocusedInput('phone')}
							onBlur={() => setFocusedInput(null)}
							keyboardType="phone-pad"
							autoComplete="tel"
							maxLength={15}
						/>
					</View>

					<View style={styles.inputContainer}>
						<View style={styles.inputLabel}>
							<Heart size={16} color={Colors.light.icon} />
							<Text style={styles.labelText}>Relacionamento</Text>
						</View>
						<TextInput
							style={[
								styles.input,
								focusedInput === 'relationship' && styles.inputFocused
							]}
							placeholder="Ex: Mãe, Pai, Amigo, Irmão"
							placeholderTextColor="#9CA3AF"
							value={contact.relationship}
							onChangeText={(text) => setContact({ ...contact, relationship: text })}
							onFocus={() => setFocusedInput('relationship')}
							onBlur={() => setFocusedInput(null)}
							autoCapitalize="words"
						/>
					</View>
				</View>

				<View style={styles.infoSection}>
					<View style={styles.infoCard}>
						<Ionicons name="shield-checkmark" size={20} color={Colors.containers.blue} />
						<Text style={styles.infoText}>
							Este contato receberá notificações quando você enviar um alerta de emergência
						</Text>
					</View>
					<View style={styles.infoCard}>
						<Ionicons name="notifications" size={20} color={Colors.containers.blue} />
						<Text style={styles.infoText}>
							Você pode ativar ou desativar as notificações a qualquer momento
						</Text>
					</View>
				</View>
			</ScrollView>

			<View style={styles.bottomContainer}>
				                <TouchableOpacity
                    style={[
                        styles.saveButton,
                        (!contact.name.trim() || !contact.phone.trim() || !contact.relationship.trim() || isSubmitting) && styles.saveButtonDisabled
                    ]}
                    onPress={handleSave}
                    disabled={!contact.name.trim() || !contact.phone.trim() || !contact.relationship.trim() || isSubmitting}
                >
                    <Text style={styles.saveButtonText}>
                        {isSubmitting ? 'Salvando...' : 'Salvar contato'}
                    </Text>
                </TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	header: {
		paddingBottom: 16,
		paddingHorizontal: 20,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	backButton: {
		paddingRight: 8,
		paddingVertical: 8,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: Colors.light.text,
	},
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	content: {
		flex: 1,
	},
	heroSection: {
		alignItems: 'center',
		padding: 32,
		paddingBottom: 24,
	},
	iconContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: Colors.lightGray,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 16,
	},
	heroTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: Colors.light.text,
		marginBottom: 8,
		textAlign: 'center',
	},
	heroSubtitle: {
		fontSize: 16,
		color: Colors.light.icon,
		textAlign: 'center',
		lineHeight: 24,
		paddingHorizontal: 20,
	},
	formSection: {
		padding: 20,
		paddingTop: 0,
	},
	inputContainer: {
		marginBottom: 24,
	},
	inputLabel: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	labelText: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.light.text,
		marginLeft: 8,
	},
	input: {
		borderWidth: 1,
		borderColor: Colors.lightGray,
		borderRadius: 12,
		padding: 16,
		fontSize: 16,
		backgroundColor: 'white',
		shadowColor: Colors.light.shadow,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
		color: Colors.light.text,
	},
	inputFocused: {
		borderColor: Colors.containers.blue,
		borderWidth: 1.5,
		shadowColor: Colors.containers.blue,
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	infoSection: {
		padding: 20,
		paddingTop: 0,
	},
	infoCard: {
		backgroundColor: Colors.lightGray,
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	infoText: {
		fontSize: 14,
		color: Colors.light.text,
		marginLeft: 12,
		flex: 1,
		lineHeight: 20,
	},
	bottomContainer: {
		padding: 20,
		paddingTop: 0,
		marginTop: 20,
	},
	saveButton: {
		backgroundColor: Colors.containers.blue,
		padding: 16,
		borderRadius: 12,
		alignItems: 'center',
		shadowColor: Colors.light.shadow,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	saveButtonDisabled: {
		backgroundColor: Colors.lightGray,
		shadowOpacity: 0,
		elevation: 0,
	},
	saveButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
	},
});

export default AddEmergencyContactScreen;