import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import {
	CrisisEntry,
	NewCrisisEntry,
	EMPTY_CRISIS_ENTRY,
} from '@/features/crisisSupport/types/crisisLog';

const INITIAL_ENTRIES: CrisisEntry[] = [
	{
		id: '1',
		date: '2024-01-15',
		time: '14:30',
		severity: 'high',
		triggers: 'Conflito no trabalho, falta de sono',
		symptoms: 'Ansiedade, taquicardia, pensamentos acelerados',
		copingStrategies: 'Respiração 4-7-8, liguei para amigo',
		notes: 'Crise durou cerca de 2 horas. Melhorou após exercício de respiração.',
	},
	{
		id: '2',
		date: '2024-01-12',
		time: '09:15',
		severity: 'medium',
		triggers: 'Reunião importante, pressão social',
		symptoms: 'Nervosismo, sudorese, dificuldade para concentrar',
		copingStrategies: 'Técnica 5-4-3-2-1, caminhada',
		notes: 'Crise controlada em 30 minutos.',
	},
];

export function useCrisisLog() {
	const [entries, setEntries] = useState<CrisisEntry[]>(INITIAL_ENTRIES);
	const [isAddingEntry, setIsAddingEntry] = useState(false);
	const [newEntry, setNewEntry] = useState<NewCrisisEntry>(EMPTY_CRISIS_ENTRY);

	const handleAddEntry = useCallback(() => {
		if (!newEntry.triggers || !newEntry.symptoms) {
			Alert.alert('Erro', 'Por favor, preencha pelo menos os gatilhos e sintomas.');
			return;
		}

		const now = new Date();
		const entry: CrisisEntry = {
			id: Date.now().toString(),
			date: now.toISOString().split('T')[0],
			time: now.toTimeString().split(' ')[0].substring(0, 5),
			severity: newEntry.severity,
			triggers: newEntry.triggers,
			symptoms: newEntry.symptoms,
			copingStrategies: newEntry.copingStrategies,
			notes: newEntry.notes,
		};

		setEntries((prev) => [entry, ...prev]);
		setNewEntry(EMPTY_CRISIS_ENTRY);
		setIsAddingEntry(false);
	}, [newEntry]);

	const handleDeleteEntry = useCallback((id: string) => {
		Alert.alert(
			'Remover Entrada',
			'Tem certeza que deseja remover esta entrada do registro?',
			[
				{ text: 'Cancelar', style: 'cancel' },
				{
					text: 'Remover',
					style: 'destructive',
					onPress: () => {
						setEntries((prev) => prev.filter((entry) => entry.id !== id));
					},
				},
			]
		);
	}, []);

	const cancelAddEntry = useCallback(() => {
		setIsAddingEntry(false);
		setNewEntry(EMPTY_CRISIS_ENTRY);
	}, []);

	const formatDate = useCallback((dateString: string) => {
		return new Date(dateString).toLocaleDateString('pt-BR');
	}, []);

	return {
		entries,
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
