import { requestAuth } from '@/shared/api/client';

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

export const emergencyContactsApi = {
	getContacts: (token: string) =>
		requestAuth<EmergencyContact[]>('/emergency-contacts', token, { method: 'GET' }),

	getContact: (token: string, id: string) =>
		requestAuth<EmergencyContact>(`/emergency-contacts/${id}`, token, { method: 'GET' }),

	createContact: (token: string, contactData: CreateEmergencyContactDto) =>
		requestAuth<EmergencyContact>('/emergency-contacts', token, {
			method: 'POST',
			body: JSON.stringify(contactData),
		}),

	updateContact: (token: string, id: string, contactData: UpdateEmergencyContactDto) =>
		requestAuth<EmergencyContact>(`/emergency-contacts/${id}`, token, {
			method: 'PATCH',
			body: JSON.stringify(contactData),
		}),

	deleteContact: (token: string, id: string) =>
		requestAuth<void>(`/emergency-contacts/${id}`, token, { method: 'DELETE' }),

	toggleContact: (token: string, id: string) =>
		requestAuth<EmergencyContact>(`/emergency-contacts/${id}/toggle`, token, { method: 'PATCH' }),
};

/** @deprecated Use emergencyContactsApi */
export const emergencyContactsService = emergencyContactsApi;
