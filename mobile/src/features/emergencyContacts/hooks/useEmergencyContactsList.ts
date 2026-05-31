import { useCallback } from 'react';
import { Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useEmergencyContacts } from '@/features/emergencyContacts/hooks/useEmergencyContacts';
import { EmergencyContact } from '@/features/emergencyContacts/api';

export function useEmergencyContactsList() {
	const {
		contacts,
		loading,
		deleteContact,
		toggleContact,
		fetchContacts,
	} = useEmergencyContacts();

	useFocusEffect(
		useCallback(() => {
			fetchContacts();
		}, [fetchContacts])
	);

	const handleDeleteContact = useCallback(async (id: string) => {
		Alert.alert(
			'Remover contato',
			'Tem certeza que deseja remover este contato de emergência?',
			[
				{ text: 'Cancelar', style: 'cancel' },
				{
					text: 'Remover',
					style: 'destructive',
					onPress: async () => {
						try {
							await deleteContact(id);
						} catch {
							Alert.alert('Erro', 'Não foi possível remover o contato. Tente novamente.');
						}
					},
				},
			]
		);
	}, [deleteContact]);

	const handleToggleContact = useCallback(async (id: string) => {
		try {
			await toggleContact(id);
		} catch {
			Alert.alert('Erro', 'Não foi possível alternar o status do contato. Tente novamente.');
		}
	}, [toggleContact]);

	const handleAddContact = useCallback(() => {
		router.push('/(config)/add-emergency-contact');
	}, []);

	const handleEditContact = useCallback((id: string) => {
		router.push(`/(config)/edit-emergency-contact?id=${id}`);
	}, []);

	const handleShowContactOptions = useCallback((contact: EmergencyContact) => {
		Alert.alert(
			contact.name,
			'Escolha uma ação:',
			[
				{ text: 'Cancelar', style: 'cancel' },
				{
					text: 'Editar',
					onPress: () => handleEditContact(contact.id),
				},
				{
					text: 'Remover',
					style: 'destructive',
					onPress: () => handleDeleteContact(contact.id),
				},
			]
		);
	}, [handleDeleteContact, handleEditContact]);

	return {
		contacts,
		loading,
		handleToggleContact,
		handleAddContact,
		handleShowContactOptions,
	};
}
