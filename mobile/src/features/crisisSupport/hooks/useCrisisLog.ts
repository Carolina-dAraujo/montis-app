import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crisisLogApi } from '@/features/crisisSupport/api';
import { crisisLogQueryKeys } from '@/features/crisisSupport/queryKeys';
import {
	CrisisEntry,
	NewCrisisEntry,
	EMPTY_CRISIS_ENTRY,
} from '@/features/crisisSupport/types/crisisLog';
import { storageService } from '@/shared/lib/storage';

async function getTokenOrThrow(): Promise<string> {
	const token = await storageService.getAuthToken();
	if (!token) throw new Error('Token não disponível');
	return token;
}

export function useCrisisLog() {
	const queryClient = useQueryClient();
	const [isAddingEntry, setIsAddingEntry] = useState(false);
	const [newEntry, setNewEntry] = useState<NewCrisisEntry>(EMPTY_CRISIS_ENTRY);

	const entriesQuery = useQuery({
		queryKey: crisisLogQueryKeys.list(),
		queryFn: async () => {
			const token = await getTokenOrThrow();
			return crisisLogApi.list(token);
		},
	});

	const createMutation = useMutation({
		mutationFn: async (entry: NewCrisisEntry) => {
			const token = await getTokenOrThrow();
			return crisisLogApi.create(token, entry);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: crisisLogQueryKeys.all });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const token = await getTokenOrThrow();
			await crisisLogApi.delete(token, id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: crisisLogQueryKeys.all });
		},
	});

	const entries: CrisisEntry[] = entriesQuery.data ?? [];

	const handleAddEntry = useCallback(async () => {
		if (!newEntry.triggers || !newEntry.symptoms) {
			Alert.alert('Erro', 'Por favor, preencha pelo menos os gatilhos e sintomas.');
			return;
		}

		try {
			await createMutation.mutateAsync(newEntry);
			setNewEntry(EMPTY_CRISIS_ENTRY);
			setIsAddingEntry(false);
		} catch {
			Alert.alert('Erro', 'Não foi possível salvar a entrada. Tente novamente.');
		}
	}, [newEntry, createMutation]);

	const handleDeleteEntry = useCallback(
		(id: string) => {
			Alert.alert(
				'Remover Entrada',
				'Tem certeza que deseja remover esta entrada do registro?',
				[
					{ text: 'Cancelar', style: 'cancel' },
					{
						text: 'Remover',
						style: 'destructive',
						onPress: async () => {
							try {
								await deleteMutation.mutateAsync(id);
							} catch {
								Alert.alert('Erro', 'Não foi possível remover a entrada.');
							}
						},
					},
				],
			);
		},
		[deleteMutation],
	);

	const cancelAddEntry = useCallback(() => {
		setIsAddingEntry(false);
		setNewEntry(EMPTY_CRISIS_ENTRY);
	}, []);

	const formatDate = useCallback((dateString: string) => {
		return new Date(dateString).toLocaleDateString('pt-BR');
	}, []);

	return {
		entries,
		isLoading: entriesQuery.isPending,
		isAddingEntry,
		setIsAddingEntry,
		newEntry,
		setNewEntry,
		handleAddEntry,
		handleDeleteEntry,
		cancelAddEntry,
		formatDate,
	};
}
