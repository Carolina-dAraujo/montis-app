import { authApi } from '@/features/auth/api';
import { storageService, StoredUserData } from '@/shared/lib/storage';
import { isAuthError } from '@/shared/api/client';
import { resolveUserDisplayName } from '@/shared/lib/displayName';
import * as SecureStore from 'expo-secure-store';

async function mergeProfileWithOnboarding(profile: StoredUserData): Promise<StoredUserData> {
	let onboardingDisplayName: string | undefined;
	try {
		const storedOnboarding = await SecureStore.getItemAsync('onboarding_data');
		if (storedOnboarding) {
			onboardingDisplayName = JSON.parse(storedOnboarding).displayName;
		}
	} catch {
		// ignore parse errors
	}

	return {
		...profile,
		displayName: resolveUserDisplayName({
			displayName: profile.displayName,
			email: profile.email,
			onboardingDisplayName,
			fallback: profile.displayName,
		}),
	};
}

export async function refreshAuthSession(): Promise<string | null> {
	const refreshToken = await storageService.getRefreshToken();
	if (!refreshToken) {
		return null;
	}

	const response = await authApi.refresh(refreshToken);
	await storageService.setAuthToken(response.token);
	await storageService.setRefreshToken(response.refreshToken);
	await storageService.setUserData(response.user);
	return response.token;
}

export async function fetchProfileWithToken(token: string): Promise<StoredUserData> {
	const profile = await authApi.getProfile(token);
	const mergedProfile = await mergeProfileWithOnboarding(profile);
	await storageService.setUserData(mergedProfile);
	return mergedProfile;
}

export async function fetchProfileWithRefresh(
	token: string,
	onTokenRefreshed?: (newToken: string) => void,
): Promise<StoredUserData> {
	try {
		return await fetchProfileWithToken(token);
	} catch (error) {
		if (!isAuthError(error)) {
			throw error;
		}

		const newToken = await refreshAuthSession();
		if (!newToken) {
			throw error;
		}

		onTokenRefreshed?.(newToken);
		return await fetchProfileWithToken(newToken);
	}
}
