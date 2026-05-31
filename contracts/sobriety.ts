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
