import { getApiUrl } from '../config/api';

export interface EmergencyAlert {
	id: string;
	userId: string;
	message: string;
	location?: {
		latitude: number;
		longitude: number;
		address?: string;
	};
	contacts: string[]; // Array of contact IDs
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

class EmergencyAlertService {
	private baseUrl: string;

	constructor() {
		this.baseUrl = getApiUrl();
	}

	private async makeAuthenticatedRequest<T>(
		endpoint: string,
		token: string,
		options: RequestInit = {}
	): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;

		const defaultOptions: RequestInit = {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
		};

		try {
			const response = await fetch(url, {
				...defaultOptions,
				...options,
				headers: {
					...defaultOptions.headers,
					...options.headers,
				},
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ message: 'Network error' }));
				throw new Error(errorData.message || `HTTP ${response.status}`);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error('[Emergency Alert API] Request failed:', error);
			if (error instanceof TypeError && error.message.includes('Network request failed')) {
				throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
			}
			throw error;
		}
	}

	async sendEmergencyAlert(token: string, alertData: SendEmergencyAlertDto): Promise<EmergencyAlert> {
		return this.makeAuthenticatedRequest<EmergencyAlert>('/emergency-alerts', token, {
			method: 'POST',
			body: JSON.stringify(alertData),
		});
	}

	async getAlertHistory(token: string): Promise<EmergencyAlert[]> {
		return this.makeAuthenticatedRequest<EmergencyAlert[]>('/emergency-alerts', token, {
			method: 'GET',
		});
	}

	async getAlert(token: string, id: string): Promise<EmergencyAlert> {
		return this.makeAuthenticatedRequest<EmergencyAlert>(`/emergency-alerts/${id}`, token, {
			method: 'GET',
		});
	}
}

export const emergencyAlertService = new EmergencyAlertService(); 