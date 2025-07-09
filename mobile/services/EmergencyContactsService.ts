import { getApiUrl } from '../config/api';

export interface EmergencyContact {
	id: string;
	userId: string;
	name: string;
	phone: string;
	relationship: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateEmergencyContactDto {
	name: string;
	phone: string;
	relationship: string;
	isActive?: boolean;
}

export interface UpdateEmergencyContactDto {
	name?: string;
	phone?: string;
	relationship?: string;
	isActive?: boolean;
}

class EmergencyContactsService {
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
			console.error('[Emergency Contacts API] Request failed:', error);
			if (error instanceof TypeError && error.message.includes('Network request failed')) {
				throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
			}
			throw error;
		}
	}

	async getContacts(token: string): Promise<EmergencyContact[]> {
		return this.makeAuthenticatedRequest<EmergencyContact[]>('/emergency-contacts', token, {
			method: 'GET',
		});
	}

	async createContact(token: string, contactData: CreateEmergencyContactDto): Promise<EmergencyContact> {
		return this.makeAuthenticatedRequest<EmergencyContact>('/emergency-contacts', token, {
			method: 'POST',
			body: JSON.stringify(contactData),
		});
	}

	async updateContact(token: string, id: string, contactData: UpdateEmergencyContactDto): Promise<EmergencyContact> {
		return this.makeAuthenticatedRequest<EmergencyContact>(`/emergency-contacts/${id}`, token, {
			method: 'PATCH',
			body: JSON.stringify(contactData),
		});
	}

	async deleteContact(token: string, id: string): Promise<void> {
		await this.makeAuthenticatedRequest<void>(`/emergency-contacts/${id}`, token, {
			method: 'DELETE',
		});
	}

	async toggleContact(token: string, id: string): Promise<EmergencyContact> {
		return this.makeAuthenticatedRequest<EmergencyContact>(`/emergency-contacts/${id}/toggle`, token, {
			method: 'PATCH',
		});
	}
}

export const emergencyContactsService = new EmergencyContactsService(); 