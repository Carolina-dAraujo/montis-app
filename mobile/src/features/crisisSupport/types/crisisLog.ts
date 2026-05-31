export type CrisisSeverity = 'low' | 'medium' | 'high';

export type CrisisEntry = {
	id: string;
	date: string;
	time: string;
	severity: CrisisSeverity;
	triggers: string;
	symptoms: string;
	copingStrategies: string;
	notes: string;
};

export type NewCrisisEntry = {
	severity: CrisisSeverity;
	triggers: string;
	symptoms: string;
	copingStrategies: string;
	notes: string;
};

export const CRISIS_SEVERITY_COLORS: Record<CrisisSeverity, string> = {
	low: '#4CAF50',
	medium: '#FF9800',
	high: '#F44336',
};

export const CRISIS_SEVERITY_LABELS: Record<CrisisSeverity, string> = {
	low: 'Baixa',
	medium: 'Média',
	high: 'Alta',
};

export const EMPTY_CRISIS_ENTRY: NewCrisisEntry = {
	severity: 'medium',
	triggers: '',
	symptoms: '',
	copingStrategies: '',
	notes: '',
};
