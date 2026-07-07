export type SobrietyGoal = 'abstinence' | 'reduction' | 'maintenance';
export type NotificationFrequency = 'daily' | 'weekly' | 'monthly' | 'never';

export interface OnboardingPreferences {
	displayName?: string;
	birthDate?: string;
	sobrietyGoal?: SobrietyGoal;
	sobrietyStartDate?: string;
	lastDrinkDate?: string;
	dailyReminders?: boolean;
	notificationFrequency?: NotificationFrequency;
	crisisSupport?: boolean;
	shareProgress?: boolean;
	address?: string;
	city?: string;
	neighborhood?: string;
	cep?: string;
	phone?: string;
	emergencyContactName?: string;
	emergencyContactPhone?: string;
	onboardingCompleted?: boolean;
	onboardingCompletedAt?: string;
}

export interface OnboardingStatus {
	onboardingCompleted: boolean;
}

export interface CompleteOnboardingResult {
	uid: string;
	email?: string;
	displayName?: string;
	phoneNumber?: string;
	onboardingCompleted: boolean;
	preferences: Partial<OnboardingPreferences>;
	sobrietyData: Record<string, unknown>;
}
