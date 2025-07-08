import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';

export interface MeetingSchedule {
	day: string;
	time: string;
	enabled: boolean;
}

export interface AAGroup {
	id: string;
	name: string;
	address: {
		city: string;
		state: string;
		neighborhood?: string;
		street?: string;
		number?: string | null;
		cep?: string;
		place?: string;
	};
	schedule: {
		[key: string]: { start: string; end: string }[];
	};
	type: 'virtual' | 'in-person';
	platform?: string;
	link?: string;
	isFeminine?: boolean;
	description?: string;
	notificationsEnabled?: boolean;
	addedAt?: string;
}

export interface UserGroup {
	id: string;
	notificationsEnabled: boolean;
	addedAt: string;
}

export function useUserGroups() {
	const [groups, setGroups] = useState<AAGroup[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadGroups = async () => {
		setLoading(true);
		setError(null);

		try {
			const token = await storageService.getAuthToken();

			if (!token) throw new Error('Usuário não autenticado');

			const allAAGroups = require('@/mobile/data/groups.json');
			const userGroups = await apiService.getUserGroups(token);

			const mergedGroups = userGroups.map((userGroup: UserGroup) => {
				const userGroupId = userGroup.id;
				const full = allAAGroups.groups.find((group: AAGroup) => group.id === userGroupId);

				return {
					...userGroup,
					...full,
				};
			});

			setGroups(mergedGroups);
		} catch (err) {
			setError('Erro ao carregar grupos');
			setGroups([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (groups.length > 0) return;

		loadGroups();
	}, []);

	const handleNotificationToggle = async (groupId: string, enabled: boolean) => {
		Alert.alert('Aviso', 'Notificações de grupo devem ser implementadas com Firebase.');
	};

	return {
		groups,
		loading,
		error,
		reloadGroups: loadGroups,
		handleNotificationToggle,
	};
}
