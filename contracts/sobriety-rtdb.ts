export interface SobrietyRtdbRecord {
	userId: string;
	startDate?: string;
	lastDrinkDate?: string;
	currentStreak: number;
	totalDays: number;
	milestones: unknown[];
	createdAt: string;
	updatedAt: string;
}
