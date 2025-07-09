export interface EmergencyAlert {
	id: string;
	userId: string;
	message: string;
	location?: {
		latitude: number;
		longitude: number;
		address?: string;
	};
	contacts: string[]; // Array of contact IDs that were notified
	status: 'sent' | 'delivered' | 'failed';
	createdAt: string;
	updatedAt: string;
} 