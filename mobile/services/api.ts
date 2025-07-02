import { getApiUrl } from '../config/api';

const API_BASE_URL = getApiUrl();

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
    user: {
        uid: string;
        email: string;
        displayName?: string;
        phoneNumber?: string;
    };
    message: string;
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

export interface ApiError {
    message: string;
    code?: string;
}

class ApiService {
    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        console.log('Making API request to:', url);

        const defaultOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, {
                ...defaultOptions,
                ...options,
            });

            console.log('API Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Network error' }));
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            if (error instanceof TypeError && error.message.includes('Network request failed')) {
                throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
            }
            throw error;
        }
    }

    private async makeAuthenticatedRequest<T>(
        endpoint: string,
        token: string,
        options: RequestInit = {}
    ): Promise<T> {
        return this.makeRequest<T>(endpoint, {
            ...options,
            headers: {
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
        });
    }

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        return this.makeRequest<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(userData: LoginRequest): Promise<AuthResponse> {
        return this.makeRequest<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async getPasswordRules(): Promise<{ rules: string[] }> {
        return this.makeRequest<{ rules: string[] }>('/auth/password-rules');
    }

    async getProfile(token: string): Promise<UserProfile> {
        return this.makeAuthenticatedRequest<UserProfile>('/auth/profile', token, {
            method: 'GET',
        });
    }

    async updateProfile(token: string, profileData: UpdateProfileRequest): Promise<UserProfile> {
        return this.makeAuthenticatedRequest<UserProfile>('/auth/profile', token, {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    async updatePassword(token: string, passwordData: UpdatePasswordRequest): Promise<{ message: string }> {
        return this.makeAuthenticatedRequest<{ message: string }>('/auth/profile/password', token, {
            method: 'PUT',
            body: JSON.stringify(passwordData),
        });
    }

    async deleteAccount(token: string): Promise<{ message: string }> {
        return this.makeAuthenticatedRequest<{ message: string }>('/auth/profile', token, {
            method: 'DELETE',
        });
    }
}

export const apiService = new ApiService(); 