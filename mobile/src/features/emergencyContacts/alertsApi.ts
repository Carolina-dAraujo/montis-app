import { requestAuth } from '@/shared/api/client';

export interface EmergencyAlert {
	id: string;
	userId: string;
	message: string;
	location?: {
		latitude: number;
		longitude: number;
		address?: string;
	};
	contacts: string[];
	status: 'sent' | 'delivered' | 'failed';
	createdAt: string;
}

export interface SendEmergencyAlertDto {
	message?: string;
	location?: {
		latitude: number;
		longitude: number;
		address?: string;
	};
}

export const emergencyAlertsApi = {
	sendEmergencyAlert: (token: string, alertData: SendEmergencyAlertDto) =>
		requestAuth<EmergencyAlert>('/emergency-alerts', token, {
			method: 'POST',
			body: JSON.stringify(alertData),
		}),

	getAlertHistory: (token: string) =>
		requestAuth<EmergencyAlert[]>('/emergency-alerts', token, { method: 'GET' }),

	getAlert: (token: string, id: string) =>
		requestAuth<EmergencyAlert>(`/emergency-alerts/${id}`, token, { method: 'GET' }),
};

/** @deprecated Use emergencyAlertsApi */
export const emergencyAlertService = emergencyAlertsApi;
