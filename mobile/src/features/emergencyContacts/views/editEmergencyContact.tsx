import { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/shared/theme/colors';
import { useEmergencyContacts } from '@/features/emergencyContacts/hooks/useEmergencyContacts';
import { useEmergencyContactForm } from '@/features/emergencyContacts/hooks/useEmergencyContactForm';
import { ConfigHeader } from '@/features/settings/components/ConfigHeader';
import { EmergencyContactFormFields } from '@/features/emergencyContacts/components/EmergencyContactFormFields';
import { styles } from '@/features/emergencyContacts/styles/emergencyContactForm.styles';
import { EmergencyContact } from '@/features/emergencyContacts/api';

export default function EditEmergencyContact() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { getContact, updateContact } = useEmergencyContacts();
	const [loading, setLoading] = useState(true);
	const [contactToEdit, setContactToEdit] = useState<EmergencyContact | null>(null);

	const {
		contact,
		setContact,
		focusedInput,
		setFocusedInput,
		isSubmitting,
		setIsSubmitting,
		handleChange,
		isFormValid,
		handleCancel,
		validateBeforeSave,
	} = useEmergencyContactForm();

	useEffect(() => {
		const loadContact = async () => {
			if (!id) {
				return;
			}

			try {
				setLoading(true);
				const contactData = await getContact(id);
				setContactToEdit(contactData);
				setContact({
					name: contactData.name,
					phone: contactData.phone,
					relationship: contactData.relationship,
				});
			} catch (error) {
				console.error('Error loading contact:', error);
			} finally {
				setLoading(false);
			}
		};

		loadContact();
	}, [id, getContact, setContact]);

	const handleSave = async () => {
		if (!validateBeforeSave() || !id) {
			return;
		}

		try {
			setIsSubmitting(true);
			await updateContact(id, {
				name: contact.name.trim(),
				phone: contact.phone.trim(),
				relationship: contact.relationship.trim(),
			});

			Alert.alert(
				'Contato atualizado',
				'Contato de emergência atualizado com sucesso!',
				[
					{
						text: 'OK',
						onPress: () => router.replace('/(config)/emergency-contacts'),
					},
				]
			);
		} catch {
			Alert.alert('Erro', 'Não foi possível atualizar o contato. Tente novamente.');
		} finally {
			setIsSubmitting(false);
		}
	};

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<ConfigHeader title="Editar contato" onBack={() => router.back()} />
				<View style={styles.loadingContainer}>
					<View style={styles.loadingIconContainer}>
						<Ionicons name="people-circle" size={48} color={Colors.containers.blue} />
					</View>
					<Text style={styles.loadingText}>Carregando contato...</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (!contactToEdit) {
		return (
			<SafeAreaView style={styles.container}>
				<ConfigHeader title="Editar contato" onBack={() => router.back()} />
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>Contato não encontrado</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ConfigHeader
				title="Editar contato"
				onBack={() => handleCancel('Tem certeza que deseja cancelar? As alterações serão perdidas.')}
			/>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<EmergencyContactFormFields
					values={contact}
					focusedInput={focusedInput}
					heroTitle="Editar contato de emergência"
					heroSubtitle="Atualize as informações do contato que receberá alertas de emergência"
					onChange={handleChange}
					onFocus={setFocusedInput}
					onBlur={() => setFocusedInput(null)}
				/>
			</ScrollView>

			<View style={styles.bottomContainer}>
				<TouchableOpacity
					style={[
						styles.saveButton,
						(!isFormValid || isSubmitting) && styles.saveButtonDisabled,
					]}
					onPress={handleSave}
					disabled={!isFormValid || isSubmitting}
				>
					<Text style={styles.saveButtonText}>
						{isSubmitting ? 'Salvando...' : 'Salvar alterações'}
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
