import { requestAuth } from '@/shared/api/client';

export interface PreferencesRequest {
	dailyReminders: boolean;
	notificationFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
	crisisSupport: boolean;
	shareProgress: boolean;
}

export interface PermissionsRequest {
	notifications: boolean;
	location: boolean;
}

export interface PermissionsResponse {
	notifications: { granted: boolean; canRequest: boolean };
	location: { granted: boolean; canRequest: boolean };
}

export const settingsApi = {
	getPreferences: (token: string) =>
		requestAuth<PreferencesRequest>('/user/preferences', token, { method: 'GET' }),

	updatePreferences: (token: string, preferences: PreferencesRequest) =>
		requestAuth<{ message: string }>('/user/preferences', token, {
			method: 'PUT',
			body: JSON.stringify(preferences),
		}),

	getPermissions: (token: string) =>
		requestAuth<PermissionsResponse>('/user/permissions', token, { method: 'GET' }),

	updatePermissions: (token: string, permissions: PermissionsRequest) =>
		requestAuth<{ message: string }>('/user/permissions', token, {
			method: 'PUT',
			body: JSON.stringify(permissions),
		}),
};
