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

export interface OnboardingRequest {
    displayName: string;
    phone?: string;
    birthDate?: string;
    sobrietyGoal: 'abstinence' | 'reduction' | 'maintenance';
    sobrietyStartDate?: string;
    lastDrinkDate?: string;
    dailyReminders: boolean;
    notificationFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
    crisisSupport: boolean;
    shareProgress: boolean;
    address?: string;
    city?: string;
    neighborhood?: string;
}

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
    notifications: {
        granted: boolean;
        canRequest: boolean;
    };
    location: {
        granted: boolean;
        canRequest: boolean;
    };
}

export interface ApiError {
    message: string;
    code?: string;
}

class ApiService {
    baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const defaultOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const response = await fetch(url, {
                ...defaultOptions,
                ...options,
                headers: {
                    ...defaultOptions.headers,
                    ...options.headers,
                },
            });


            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Network error' }));
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('[API DEBUG] Request failed:', error);
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

    async completeOnboarding(token: string, onboardingData: OnboardingRequest): Promise<{ message: string; user: UserProfile }> {
        try {
            const result = await this.makeAuthenticatedRequest<{ message: string; user: UserProfile }>('/auth/onboarding', token, {
                method: 'POST',
                body: JSON.stringify(onboardingData),
            });
            return result;
        } catch (error) {
            console.error('API Service - completeOnboarding error:', error);
            throw error;
        }
    }

    async checkOnboardingStatus(token: string): Promise<{ onboardingCompleted: boolean }> {
        try {
            const response = await this.makeAuthenticatedRequest<{ onboardingCompleted: boolean }>('/auth/onboarding/status', token, {
                method: 'GET',
            });
            return response;
        } catch (error) {
            try {
                const profile = await this.getProfile(token);
                return { onboardingCompleted: true };
            } catch (profileError) {
                return { onboardingCompleted: false };
            }
        }
    }

    async getOnboardingData(token: string): Promise<OnboardingRequest> {
        try {
            const result = await this.makeAuthenticatedRequest<OnboardingRequest>('/auth/onboarding', token, {
                method: 'GET',
            });
            return result;
        } catch (error) {
            console.error('API Service - getOnboardingData error:', error);
            throw error;
        }
    }

    async testOnboarding(token: string, onboardingData: any): Promise<any> {
        try {
            const result = await this.makeAuthenticatedRequest<any>('/auth/onboarding/test', token, {
                method: 'POST',
                body: JSON.stringify(onboardingData),
            });
            return result;
        } catch (error) {
            console.error('API Service - testOnboarding error:', error);
            throw error;
        }
    }

    async updatePreferences(token: string, preferences: PreferencesRequest): Promise<{ message: string }> {
        try {
            const result = await this.makeAuthenticatedRequest<{ message: string }>('/user/preferences', token, {
                method: 'PUT',
                body: JSON.stringify(preferences),
            });
            return result;
        } catch (error) {
            console.error('API Service - updatePreferences error:', error);
            throw error;
        }
    }

    async getPreferences(token: string): Promise<PreferencesRequest> {
        try {
            const result = await this.makeAuthenticatedRequest<PreferencesRequest>('/user/preferences', token, {
                method: 'GET',
            });
            return result;
        } catch (error) {
            console.error('API Service - getPreferences error:', error);
            throw error;
        }
    }

    async updatePermissions(token: string, permissions: PermissionsRequest): Promise<{ message: string }> {
        try {
            const result = await this.makeAuthenticatedRequest<{ message: string }>('/user/permissions', token, {
                method: 'PUT',
                body: JSON.stringify(permissions),
            });
            return result;
        } catch (error) {
            console.error('API Service - updatePermissions error:', error);
            throw error;
        }
    }

    async getPermissions(token: string): Promise<PermissionsResponse> {
        try {
            const result = await this.makeAuthenticatedRequest<PermissionsResponse>('/user/permissions', token, {
                method: 'GET',
            });
            return result;
        } catch (error) {
            console.error('API Service - getPermissions error:', error);
            throw error;
        }
    }

    async addAAGroup(token: string, groupData: {
        groupId: string;
        notificationsEnabled: boolean;
    }): Promise<{
        message: string;
        groupId: string;
        addedAt: string;
    }> {
        try {
            const result = await this.makeAuthenticatedRequest<any>('/groups/add-aa-group', token, {
                method: 'POST',
                body: JSON.stringify(groupData),
            });
            return result;
        } catch (error) {
            console.error('API Service - addAAGroup error:', error);
            throw error;
        }
    }

    async getUserGroups(token: string): Promise<Array<{
        id: string;
        notificationsEnabled: boolean;
        addedAt: string;
    }>> {
        try {
            const result = await this.makeAuthenticatedRequest<any>('/groups/user-groups', token, {
                method: 'GET',
            });

            return result;
        } catch (error) {
            console.error('API Service - getUserGroups error:', error);
            throw error;
        }
    }

    async updateGroupNotifications(token: string, groupId: string, notificationsEnabled: boolean): Promise<{ message: string }> {
        try {
            const result = await this.makeAuthenticatedRequest<{ message: string }>(`/groups/group/${groupId}/notifications`, token, {
                method: 'PUT',
                body: JSON.stringify({ notificationsEnabled }),
            });
            return result;
        } catch (error) {
            console.error('API Service - updateGroupNotifications error:', error);
            throw error;
        }
    }

    async updateMeetingNotification(
        token: string,
        groupId: string,
        day: string,
        meetingIndex: number,
        notificationsEnabled: boolean
    ): Promise<{ message: string }> {
        try {
            const result = await this.makeAuthenticatedRequest<{ message: string }>(
                `/groups/group/${groupId}/meeting/${day}/${meetingIndex}/notifications`,
                token,
                {
                    method: 'PUT',
                    body: JSON.stringify({ notificationsEnabled }),
                }
            );
            return result;
        } catch (error) {
            console.error('API Service - updateMeetingNotification error:', error);
            throw error;
        }
    }

    async getMeetingNotifications(token: string, groupId: string): Promise<{ [day: string]: { [index: number]: boolean } }> {
        try {
            const result = await this.makeAuthenticatedRequest<{ [day: string]: { [index: number]: boolean } }>(
                `/groups/group/${groupId}/meeting-notifications`,
                token,
                {
                    method: 'GET',
                }
            );
            return result;
        } catch (error) {
            console.error('API Service - getMeetingNotifications error:', error);
            throw error;
        }
    }

    async getAllAAGroups(): Promise<any[]> {
        try {
            const result = await this.makeRequest<any[]>('/groups/all-aa-groups');
            return result;
        } catch (error) {
            throw error;
        }
    }

    async addUserGroup(token: string, groupId: string, notificationsEnabled = false): Promise<any> {
        return this.makeAuthenticatedRequest('/groups/add-aa-group', token, {
            method: 'POST',
            body: JSON.stringify({ groupId, notificationsEnabled }),
        });
    }
}

export const apiService = new ApiService();
