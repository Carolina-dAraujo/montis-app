import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';

export interface MeetingSchedule {
	day: string;
	time: string;
	enabled: boolean;
}

export interface MeetingTime {
	start: string;
	end: string;
	notificationsEnabled?: boolean;
}

export interface GroupSchedule {
	[key: string]: MeetingTime[];
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
	schedule: GroupSchedule;
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

	const handleMeetingNotificationToggle = async (
		groupId: string,
		day: string,
		meetingIndex: number,
		enabled: boolean
	) => {
		try {
			const token = await storageService.getAuthToken();
			if (!token) throw new Error('Usuário não autenticado');

			await apiService.updateMeetingNotification(token, groupId, day, meetingIndex, enabled);

			setGroups(prevGroups =>
				prevGroups.map(group => {
					if (group.id === groupId && group.schedule && group.schedule[day]) {
						const updatedSchedule = { ...group.schedule };
						if (updatedSchedule[day] && updatedSchedule[day][meetingIndex]) {
							updatedSchedule[day][meetingIndex] = {
								...updatedSchedule[day][meetingIndex],
								notificationsEnabled: enabled
							};
						}
						return { ...group, schedule: updatedSchedule };
					}
					return group;
				})
			);
		} catch (error) {
			console.error('Error updating meeting notification:', error);
			Alert.alert('Erro', 'Não foi possível atualizar as notificações da reunião');
		}
	};

	return {
		groups,
		loading,
		error,
		reloadGroups: loadGroups,
		handleNotificationToggle,
		handleMeetingNotificationToggle,
	};
}
