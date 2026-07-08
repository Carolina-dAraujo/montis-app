import { request, requestAuth } from '@/shared/api/client';

export interface RegisterRequest {
	email: string;
	password: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface AuthResponse {
	token: string;
	refreshToken: string;
	user: {
		uid: string;
		email: string;
		displayName?: string;
		phoneNumber?: string;
	};
	message: string;
}

export interface RefreshAuthResponse {
	token: string;
	refreshToken: string;
}

export interface UpdateProfileRequest {
	displayName?: string;
	phone?: string;
	email?: string;
}

export interface UpdatePasswordRequest {
	currentPassword: string;
	newPassword: string;
}

export interface UserProfile {
	uid: string;
	email: string;
	displayName?: string;
	phoneNumber?: string;
}

export const authApi = {
	register: (userData: RegisterRequest) =>
		request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),

	login: (userData: LoginRequest) =>
		request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(userData) }),

	refresh: (refreshToken: string) =>
		request<RefreshAuthResponse>('/auth/refresh', {
			method: 'POST',
			body: JSON.stringify({ refreshToken }),
		}),

	getPasswordRules: () => request<{ rules: string[] }>('/auth/password-rules'),

	getProfile: (token: string) =>
		requestAuth<UserProfile>('/auth/profile', token, { method: 'GET' }),

	updateProfile: (token: string, profileData: UpdateProfileRequest) =>
		requestAuth<UserProfile>('/auth/profile', token, {
			method: 'PUT',
			body: JSON.stringify(profileData),
		}),

	updatePassword: (token: string, passwordData: UpdatePasswordRequest) =>
		requestAuth<{ message: string }>('/auth/profile/password', token, {
			method: 'PUT',
			body: JSON.stringify(passwordData),
		}),

	deleteAccount: (token: string) =>
		requestAuth<{ message: string }>('/auth/profile', token, { method: 'DELETE' }),

	checkOnboardingStatus: async (token: string): Promise<{ onboardingCompleted: boolean }> => {
		try {
			return await requestAuth<{ onboardingCompleted: boolean }>(
				'/auth/onboarding/status',
				token,
				{ method: 'GET' }
			);
		} catch {
			try {
				await requestAuth<UserProfile>('/auth/profile', token, { method: 'GET' });
				return { onboardingCompleted: true };
			} catch {
				return { onboardingCompleted: false };
			}
		}
	},

	uploadProfileImage: async (token: string, fileUri: string): Promise<{ imageUrl: string }> => {
		const { getBaseUrl } = await import('@/shared/api/client');
		const formData = new FormData();
		const fileName = fileUri.split('/').pop() || 'profile.jpg';
		const fileType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
		formData.append('file', { uri: fileUri, name: fileName, type: fileType } as unknown as Blob);

		const response = await fetch(`${getBaseUrl()}/auth/profile/image`, {
			method: 'PUT',
			headers: { Authorization: `Bearer ${token}` },
			body: formData as unknown as BodyInit,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: 'Erro ao enviar imagem' }));
			throw new Error(errorData.message || `HTTP ${response.status}`);
		}

		return response.json();
	},
};
