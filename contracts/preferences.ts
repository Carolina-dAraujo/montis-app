import type { NotificationFrequency } from './onboarding';

export interface UserPreferences {
	displayName?: string;
	phone?: string;
	dailyReminders?: boolean;
	notificationFrequency?: NotificationFrequency;
	crisisSupport?: boolean;
	shareProgress?: boolean;
	[key: string]: unknown;
}
