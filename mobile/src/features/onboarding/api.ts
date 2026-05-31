import { requestAuth } from '@/shared/api/client';
import type { UserProfile } from '@/features/auth/api';

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
	cep?: string;
}

export const onboardingApi = {
	completeOnboarding: (token: string, onboardingData: OnboardingRequest) =>
		requestAuth<{ message: string; user: UserProfile }>('/auth/onboarding', token, {
			method: 'POST',
			body: JSON.stringify(onboardingData),
		}),

	getOnboardingData: (token: string) =>
		requestAuth<OnboardingRequest>('/auth/onboarding', token, { method: 'GET' }),
};
