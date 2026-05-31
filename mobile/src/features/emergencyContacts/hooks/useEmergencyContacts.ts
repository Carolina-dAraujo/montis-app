import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	emergencyContactsApi,
	type EmergencyContact,
	type CreateEmergencyContactDto,
	type UpdateEmergencyContactDto,
} from '@/features/emergencyContacts/api';
import { emergencyContactsQueryKeys } from '@/features/emergencyContacts/queryKeys';
import { storageService } from '@/shared/lib/storage';

async function getTokenOrThrow(): Promise<string> {
	const token = await storageService.getAuthToken();
	if (!token) throw new Error('Token não disponível');
	return token;
}

export function useEmergencyContacts() {
	const queryClient = useQueryClient();

	const contactsQuery = useQuery({
		queryKey: emergencyContactsQueryKeys.list(),
		queryFn: async () => {
			const token = await getTokenOrThrow();
			return emergencyContactsApi.getContacts(token);
		},
	});

	const createMutation = useMutation({
		mutationFn: async (contactData: CreateEmergencyContactDto) => {
			const token = await getTokenOrThrow();
			return emergencyContactsApi.createContact(token, contactData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: emergencyContactsQueryKeys.all });
		},
	});

	const updateMutation = useMutation({
		mutationFn: async ({ id, data }: { id: string; data: UpdateEmergencyContactDto }) => {
			const token = await getTokenOrThrow();
			return emergencyContactsApi.updateContact(token, id, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: emergencyContactsQueryKeys.all });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const token = await getTokenOrThrow();
			await emergencyContactsApi.deleteContact(token, id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: emergencyContactsQueryKeys.all });
		},
	});

	const toggleMutation = useMutation({
		mutationFn: async (id: string) => {
			const token = await getTokenOrThrow();
			return emergencyContactsApi.toggleContact(token, id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: emergencyContactsQueryKeys.all });
		},
	});

	const createContact = async (contactData: CreateEmergencyContactDto): Promise<EmergencyContact> => {
		try {
			return await createMutation.mutateAsync(contactData);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Erro ao criar contato';
			throw new Error(errorMessage);
		}
	};

	const updateContact = async (id: string, contactData: UpdateEmergencyContactDto): Promise<EmergencyContact> => {
		try {
			return await updateMutation.mutateAsync({ id, data: contactData });
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar contato';
			throw new Error(errorMessage);
		}
	};

	const deleteContact = async (id: string): Promise<void> => {
		try {
			await deleteMutation.mutateAsync(id);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir contato';
			throw new Error(errorMessage);
		}
	};

	const toggleContact = async (id: string): Promise<EmergencyContact> => {
		try {
			return await toggleMutation.mutateAsync(id);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Erro ao alterar contato';
			throw new Error(errorMessage);
		}
	};

	const refetch = () => contactsQuery.refetch();

	const getContact = async (id: string): Promise<EmergencyContact> => {
		const token = await getTokenOrThrow();
		return emergencyContactsApi.getContact(token, id);
	};

	return {
		contacts: contactsQuery.data ?? [],
		loading: contactsQuery.isPending,
		error: contactsQuery.error instanceof Error ? contactsQuery.error.message : null,
		createContact,
		updateContact,
		deleteContact,
		toggleContact,
		refetch,
		fetchContacts: refetch,
		getContact,
	};
}
