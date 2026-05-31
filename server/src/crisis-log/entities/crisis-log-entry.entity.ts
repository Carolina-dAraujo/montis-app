export interface CrisisLogEntry {
	id: string;
	date: string;
	time: string;
	severity: 'low' | 'medium' | 'high';
	triggers: string;
	symptoms: string;
	copingStrategies: string;
	notes: string;
	createdAt: string;
	updatedAt: string;
}
