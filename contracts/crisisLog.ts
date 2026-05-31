export type CrisisSeverity = 'low' | 'medium' | 'high';

export interface CrisisLogEntry {
	id: string;
	date: string;
	time: string;
	severity: CrisisSeverity;
	triggers: string;
	symptoms: string;
	copingStrategies: string;
	notes: string;
	createdAt?: string;
	updatedAt?: string;
}
