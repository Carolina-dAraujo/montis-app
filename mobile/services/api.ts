/**
 * Compatibility barrel — prefer feature APIs (@/features/auth/api, etc.)
 */
import { authApi, type RegisterRequest, type LoginRequest, type AuthResponse, type UserProfile, type UpdateProfileRequest, type UpdatePasswordRequest } from '@/features/auth/api';
import { onboardingApi, type OnboardingRequest } from '@/features/onboarding/api';
import { settingsApi, type PreferencesRequest, type PermissionsRequest, type PermissionsResponse } from '@/features/settings/api';
import { groupsApi } from '@/features/groups/api';
import { trackingApi } from '@/features/tracking/api';

export type { RegisterRequest, LoginRequest, AuthResponse, UserProfile, UpdateProfileRequest, UpdatePasswordRequest, OnboardingRequest, PreferencesRequest, PermissionsRequest, PermissionsResponse };

export const apiService = {
	...authApi,
	completeOnboarding: onboardingApi.completeOnboarding,
	getOnboardingData: onboardingApi.getOnboardingData,
	getPreferences: settingsApi.getPreferences,
	updatePreferences: settingsApi.updatePreferences,
	getPermissions: settingsApi.getPermissions,
	updatePermissions: settingsApi.updatePermissions,
	getUserGroups: groupsApi.getUserGroups,
	addAAGroup: groupsApi.addAAGroup,
	addUserGroup: groupsApi.addAAGroup,
	updateGroupNotifications: groupsApi.updateGroupNotifications,
	updateMeetingNotification: groupsApi.updateMeetingNotification,
	getMeetingNotifications: groupsApi.getMeetingNotifications,
	getAllAAGroups: groupsApi.getAllAAGroups,
	getDailyTracking: trackingApi.getDailyTracking,
	saveDailyTracking: trackingApi.saveDailyTracking,
	testOnboarding: async () => {
		throw new Error('testOnboarding is not implemented');
	},
};
