import { Alert } from 'react-native';
import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsApi } from '@/features/groups/api';
import { groupsQueryKeys } from '@/features/groups/queryKeys';
import { storageService } from '@/shared/lib/storage';

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

async function getTokenOrThrow(): Promise<string> {
	const token = await storageService.getAuthToken();
	if (!token) throw new Error('Usuário não autenticado');
	return token;
}

function mergeUserGroups(userGroups: UserGroup[]): AAGroup[] {
	const allAAGroups = require('@/data/groups.json');

	return userGroups.map((userGroup) => {
		const full = allAAGroups.groups.find((group: AAGroup) => group.id === userGroup.id);
		return {
			...userGroup,
			...full,
		};
	});
}

export function useUserGroups() {
	const queryClient = useQueryClient();

	const groupsQuery = useQuery({
		queryKey: groupsQueryKeys.userGroups(),
		queryFn: async () => {
			const token = await getTokenOrThrow();
			const userGroups = await groupsApi.getUserGroups(token);
			return mergeUserGroups(userGroups);
		},
	});

	const groupNotificationMutation = useMutation({
		mutationFn: async ({ groupId, enabled }: { groupId: string; enabled: boolean }) => {
			const token = await getTokenOrThrow();
			await groupsApi.updateGroupNotifications(token, groupId, enabled);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: groupsQueryKeys.all });
		},
	});

	const meetingNotificationMutation = useMutation({
		mutationFn: async ({
			groupId,
			day,
			meetingIndex,
			enabled,
		}: {
			groupId: string;
			day: string;
			meetingIndex: number;
			enabled: boolean;
		}) => {
			const token = await getTokenOrThrow();
			await groupsApi.updateMeetingNotification(token, groupId, day, meetingIndex, enabled);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: groupsQueryKeys.all });
		},
	});

	const removeGroupMutation = useMutation({
		mutationFn: async (groupId: string) => {
			const token = await getTokenOrThrow();
			await groupsApi.removeAAGroup(token, groupId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: groupsQueryKeys.all });
		},
	});

	const handleNotificationToggle = async (groupId: string, enabled: boolean) => {
		try {
			await groupNotificationMutation.mutateAsync({ groupId, enabled });
		} catch {
			Alert.alert('Erro', 'Não foi possível atualizar as notificações do grupo');
		}
	};

	const handleMeetingNotificationToggle = async (
		groupId: string,
		day: string,
		meetingIndex: number,
		enabled: boolean,
	) => {
		try {
			await meetingNotificationMutation.mutateAsync({
				groupId,
				day,
				meetingIndex,
				enabled,
			});
		} catch {
			Alert.alert('Erro', 'Não foi possível atualizar as notificações da reunião');
		}
	};

	const handleRemoveGroup = async (groupId: string) => {
		await removeGroupMutation.mutateAsync(groupId);
	};

	const confirmRemoveGroup = useCallback(
		(group: Pick<AAGroup, 'id' | 'name'>, onRemoved?: () => void) => {
			if (removeGroupMutation.isPending) {
				return;
			}

			Alert.alert(
				'Remover grupo',
				`Tem certeza que deseja remover "${group.name}" dos seus grupos?`,
				[
					{ text: 'Cancelar', style: 'cancel' },
					{
						text: 'Remover',
						style: 'destructive',
						onPress: async () => {
							try {
								await removeGroupMutation.mutateAsync(group.id);
								onRemoved?.();
							} catch {
								Alert.alert('Erro', 'Não foi possível remover o grupo. Tente novamente.');
							}
						},
					},
				],
			);
		},
		[removeGroupMutation],
	);

	return {
		groups: groupsQuery.data ?? [],
		loading: groupsQuery.isPending,
		removing: removeGroupMutation.isPending,
		error: groupsQuery.error ? 'Erro ao carregar grupos' : null,
		reloadGroups: () => groupsQuery.refetch(),
		handleNotificationToggle,
		handleMeetingNotificationToggle,
		handleRemoveGroup,
		confirmRemoveGroup,
	};
}
