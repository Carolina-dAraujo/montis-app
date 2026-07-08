import { authApi } from '@/features/auth/api';
import { storageService } from '@/shared/lib/storage';

let refreshInFlight: Promise<string | null> | null = null;
let onTokenRefreshed: ((token: string) => void) | null = null;

export function setAuthTokenRefreshListener(listener: ((token: string) => void) | null): void {
	onTokenRefreshed = listener;
}

export async function refreshAuthSession(): Promise<string | null> {
	if (refreshInFlight) {
		return refreshInFlight;
	}

	refreshInFlight = (async () => {
		const refreshToken = await storageService.getRefreshToken();
		if (!refreshToken) {
			return null;
		}

		try {
			const response = await authApi.refresh(refreshToken);
			await storageService.setAuthToken(response.token);
			await storageService.setRefreshToken(response.refreshToken);
			onTokenRefreshed?.(response.token);
			return response.token;
		} catch {
			return null;
		} finally {
			refreshInFlight = null;
		}
	})();

	return refreshInFlight;
}

export async function persistAuthSession(response: {
	token: string;
	refreshToken: string;
}): Promise<void> {
	await storageService.setAuthToken(response.token);
	await storageService.setRefreshToken(response.refreshToken);
}
