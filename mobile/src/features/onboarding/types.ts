export enum SobrietyGoal {
	ABSTINENCE = 'abstinence',
	REDUCTION = 'reduction',
	MAINTENANCE = 'maintenance',
}

export enum NotificationFrequency {
	DAILY = 'daily',
	WEEKLY = 'weekly',
	MONTHLY = 'monthly',
	NEVER = 'never',
}

export interface OnboardingData {
	displayName?: string;
	phone?: string;
	birthDate?: string;
	isCurrentlySober?: boolean;
	sobrietyGoal?: 'abstinence' | 'reduction' | 'maintenance';
	sobrietyStartDate?: string;
	lastDrinkDate?: string;
	dailyReminders?: boolean;
	notificationFrequency?: 'daily' | 'weekly' | 'monthly' | 'never';
	crisisSupport?: boolean;
	shareProgress?: boolean;
	rehabilitationGoals?: string[];
	address?: string;
	city?: string;
	neighborhood?: string;
	cep?: string;
	_initialized?: boolean;
}
