import { useState, useEffect, useCallback } from 'react';
import { emergencyContactsService, EmergencyContact, CreateEmergencyContactDto, UpdateEmergencyContactDto } from '../services/EmergencyContactsService';
import { storageService } from '../services/storage';

export const useEmergencyContacts = () => {
	const [contacts, setContacts] = useState<EmergencyContact[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchContacts = useCallback(async () => {
		try {
			const token = await storageService.getAuthToken();
			if (!token) return;

			setLoading(true);
			setError(null);
			const data = await emergencyContactsService.getContacts(token);
			setContacts(data);
		} catch (err) {
			console.error('Error fetching emergency contacts:', err);
			setError(err instanceof Error ? err.message : 'Erro ao carregar contatos');
		} finally {
			setLoading(false);
		}
	}, []);

	const createContact = useCallback(async (contactData: CreateEmergencyContactDto): Promise<EmergencyContact> => {
		try {
			const token = await storageService.getAuthToken();
			if (!token) throw new Error('Token não disponível');

			setError(null);
			const newContact = await emergencyContactsService.createContact(token, contactData);
			setContacts(prev => [newContact, ...prev]);
			return newContact;
		} catch (err) {
			console.error('Error creating emergency contact:', err);
			const errorMessage = err instanceof Error ? err.message : 'Erro ao criar contato';
			setError(errorMessage);
			throw new Error(errorMessage);
		}
	}, []);

	const updateContact = useCallback(async (id: string, contactData: UpdateEmergencyContactDto): Promise<EmergencyContact> => {
		try {
			const token = await storageService.getAuthToken();
			if (!token) throw new Error('Token não disponível');

			setError(null);
			const updatedContact = await emergencyContactsService.updateContact(token, id, contactData);
			setContacts(prev => prev.map(contact =>
				contact.id === id ? updatedContact : contact
			));
			return updatedContact;
		} catch (err) {
			console.error('Error updating emergency contact:', err);
			const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar contato';
			setError(errorMessage);
			throw new Error(errorMessage);
		}
	}, []);

	const deleteContact = useCallback(async (id: string): Promise<void> => {
		try {
			const token = await storageService.getAuthToken();
			if (!token) throw new Error('Token não disponível');

			setError(null);
			await emergencyContactsService.deleteContact(token, id);
			setContacts(prev => prev.filter(contact => contact.id !== id));
		} catch (err) {
			console.error('Error deleting emergency contact:', err);
			const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar contato';
			setError(errorMessage);
			throw new Error(errorMessage);
		}
	}, []);

	const toggleContact = useCallback(async (id: string): Promise<EmergencyContact> => {
		try {
			const token = await storageService.getAuthToken();
			if (!token) throw new Error('Token não disponível');

			setError(null);
			const updatedContact = await emergencyContactsService.toggleContact(token, id);
			setContacts(prev => prev.map(contact =>
				contact.id === id ? updatedContact : contact
			));
			return updatedContact;
		} catch (err) {
			console.error('Error toggling emergency contact:', err);
			const errorMessage = err instanceof Error ? err.message : 'Erro ao alternar contato';
			setError(errorMessage);
			throw new Error(errorMessage);
		}
	}, []);

	useEffect(() => {
		fetchContacts();
	}, [fetchContacts]);

	return {
		contacts,
		loading,
		error,
		fetchContacts,
		createContact,
		updateContact,
		deleteContact,
		toggleContact,
	};
};
