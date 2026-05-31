import { requestAuth } from '@/shared/api/client';

export interface SobrietyMilestone {
	id: string;
	days: number;
	achieved: boolean;
	achievedDate?: string;
	title: string;
	description: string;
}

export interface SobrietyData {
	userId: string;
	startDate: string;
	lastDrinkDate?: string;
	currentStreak: number;
	totalDays: number;
	milestones: SobrietyMilestone[];
}

export const sobrietyApi = {
	getData: (token: string) =>
		requestAuth<SobrietyData>('/sobriety/data', token, { method: 'GET' }),
};
