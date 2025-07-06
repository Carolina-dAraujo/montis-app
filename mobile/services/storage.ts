import * as SecureStore from 'expo-secure-store';

export interface StoredUserData {
	uid: string;
	email: string;
	displayName?: string;
	phoneNumber?: string;
}

class StorageService {
	private readonly AUTH_TOKEN_KEY = 'auth_token';
	private readonly USER_DATA_KEY = 'user_data';
	private readonly IS_LOGGED_IN_KEY = 'is_logged_in';

	async setAuthToken(token: string): Promise<void> {
		try {
			await SecureStore.setItemAsync(this.AUTH_TOKEN_KEY, token);
			await SecureStore.setItemAsync(this.IS_LOGGED_IN_KEY, 'true');
		} catch (error) {
			console.error('Error saving auth token:', error);
			throw error;
		}
	}

	async getAuthToken(): Promise<string | null> {
		try {
			const token = await SecureStore.getItemAsync(this.AUTH_TOKEN_KEY);
			return token;
		} catch (error) {
			console.error('Error getting auth token:', error);
			return null;
		}
	}

	async setUserData(userData: StoredUserData): Promise<void> {
		try {
			await SecureStore.setItemAsync(this.USER_DATA_KEY, JSON.stringify(userData));
		} catch (error) {
			console.error('Error saving user data:', error);
			throw error;
		}
	}

	async getUserData(): Promise<StoredUserData | null> {
		try {
			const userData = await SecureStore.getItemAsync(this.USER_DATA_KEY);
			const parsed = userData ? JSON.parse(userData) : null;
			return parsed;
		} catch (error) {
			console.error('Error getting user data:', error);
			return null;
		}
	}

	async isLoggedIn(): Promise<boolean> {
		try {
			const isLoggedIn = await SecureStore.getItemAsync(this.IS_LOGGED_IN_KEY);
			const result = isLoggedIn === 'true';
			return result;
		} catch (error) {
			console.error('Error checking login status:', error);
			return false;
		}
	}

	async clearAuthData(): Promise<void> {
		try {
			await SecureStore.deleteItemAsync(this.AUTH_TOKEN_KEY);
			await SecureStore.deleteItemAsync(this.USER_DATA_KEY);
			await SecureStore.deleteItemAsync(this.IS_LOGGED_IN_KEY);
		} catch (error) {
			console.error('Error clearing auth data:', error);
			throw error;
		}
	}

	async updateUserData(userData: Partial<StoredUserData>): Promise<void> {
		try {
			const currentData = await this.getUserData();
			if (currentData) {
				const updatedData = { ...currentData, ...userData };
				await this.setUserData(updatedData);
			}
		} catch (error) {
			console.error('Error updating user data:', error);
			throw error;
		}
	}
}

export const storageService = new StorageService();
