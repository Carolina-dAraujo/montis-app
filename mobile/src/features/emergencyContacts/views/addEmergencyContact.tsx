import { ScrollView, TouchableOpacity, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useEmergencyContacts } from '@/features/emergencyContacts/hooks/useEmergencyContacts';
import { useEmergencyContactForm } from '@/features/emergencyContacts/hooks/useEmergencyContactForm';
import { ConfigHeader } from '@/features/settings/components/ConfigHeader';
import { EmergencyContactFormFields } from '@/features/emergencyContacts/components/EmergencyContactFormFields';
import { styles } from '@/features/emergencyContacts/styles/emergencyContactForm.styles';

export default function AddEmergencyContact() {
	const { createContact } = useEmergencyContacts();
	const {
		contact,
		focusedInput,
		setFocusedInput,
		isSubmitting,
		setIsSubmitting,
		handleChange,
		isFormValid,
		handleCancel,
		validateBeforeSave,
	} = useEmergencyContactForm();

	const handleSave = async () => {
		if (!validateBeforeSave()) {
			return;
		}

		try {
			setIsSubmitting(true);
			await createContact({
				name: contact.name.trim(),
				phone: contact.phone.trim(),
				relationship: contact.relationship.trim(),
				isActive: true,
			});

			Alert.alert(
				'Contato salvo',
				'Contato de emergência adicionado com sucesso!',
				[
					{
						text: 'OK',
						onPress: () => router.replace('/(config)/emergency-contacts'),
					},
				]
			);
		} catch {
			Alert.alert('Erro', 'Não foi possível salvar o contato. Tente novamente.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<ConfigHeader
				title="Adicionar contato"
				onBack={() => handleCancel('Tem certeza que deseja cancelar? As informações serão perdidas.')}
			/>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<EmergencyContactFormFields
					values={contact}
					focusedInput={focusedInput}
					heroTitle="Contato de Emergência"
					heroSubtitle="Adicione um contato que receberá alertas quando você enviar um sinal de emergência"
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
						{isSubmitting ? 'Salvando...' : 'Salvar contato'}
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
