import { Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/features/settings/api';
import { settingsQueryKeys } from '@/features/settings/queryKeys';
import { storageService } from '@/shared/lib/storage';
import { NotificationFrequency } from '@/features/onboarding/types';

export interface Preferences {
	dailyReminders: boolean;
	notificationFrequency: NotificationFrequency;
	crisisSupport: boolean;
	shareProgress: boolean;
	displayName?: string;
	phone?: string;
	birthDate?: string;
	sobrietyGoal?: string;
	sobrietyStartDate?: string;
	lastDrinkDate?: string;
	emergencyContactName?: string;
	emergencyContactPhone?: string;
	address?: string;
	city?: string;
	neighborhood?: string;
	cep?: string;
}

export interface Permissions {
	notifications: boolean;
	location: boolean;
}

const defaultPreferences: Preferences = {
	dailyReminders: false,
	notificationFrequency: NotificationFrequency.DAILY,
	crisisSupport: false,
	shareProgress: false,
};

const defaultPermissions: Permissions = {
	notifications: false,
	location: false,
};

async function getTokenOrThrow(): Promise<string> {
	const token = await storageService.getAuthToken();
	if (!token) throw new Error('Token não disponível');
	return token;
}

export const usePreferences = () => {
	const queryClient = useQueryClient();

	const preferencesQuery = useQuery({
		queryKey: settingsQueryKeys.preferences(),
		queryFn: async () => {
			const token = await getTokenOrThrow();
			const data = await settingsApi.getPreferences(token);
			return {
				...defaultPreferences,
				...data,
				notificationFrequency: data.notificationFrequency as NotificationFrequency,
			};
		},
	});

	const permissionsQuery = useQuery({
		queryKey: settingsQueryKeys.permissions(),
		queryFn: async () => {
			const token = await getTokenOrThrow();
			const data = await settingsApi.getPermissions(token);
			return {
				notifications: data.notifications.granted,
				location: data.location.granted,
			};
		},
	});

	const updatePreferencesMutation = useMutation({
		mutationFn: async (newPreferences: Partial<Preferences>) => {
			const token = await getTokenOrThrow();
			const current = preferencesQuery.data ?? defaultPreferences;
			const updated = { ...current, ...newPreferences };
			await settingsApi.updatePreferences(token, updated);
			return updated;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: settingsQueryKeys.preferences() });
		},
	});

	const updatePermissionsMutation = useMutation({
		mutationFn: async (newPermissions: Partial<Permissions>) => {
			const token = await getTokenOrThrow();
			const current = permissionsQuery.data ?? defaultPermissions;
			const updated = { ...current, ...newPermissions };
			await settingsApi.updatePermissions(token, {
				notifications: updated.notifications,
				location: updated.location,
			});
			return updated;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: settingsQueryKeys.permissions() });
		},
	});

	const updatePreferences = async (newPreferences: Partial<Preferences>) => {
		try {
			await updatePreferencesMutation.mutateAsync(newPreferences);
		} catch {
			Alert.alert('Erro', 'Não foi possível salvar as preferências. Tente novamente.');
		}
	};

	const updatePermissions = async (newPermissions: Partial<Permissions>) => {
		try {
			await updatePermissionsMutation.mutateAsync(newPermissions);
		} catch {
			Alert.alert('Erro', 'Não foi possível salvar as permissões. Tente novamente.');
		}
	};

	const isLoading =
		updatePreferencesMutation.isPending || updatePermissionsMutation.isPending;

	return {
		preferences: preferencesQuery.data ?? defaultPreferences,
		permissions: permissionsQuery.data ?? defaultPermissions,
		isLoading,
		updatePreferences,
		updatePermissions,
		loadPreferences: () => preferencesQuery.refetch(),
		loadPermissions: () => permissionsQuery.refetch(),
	};
};
