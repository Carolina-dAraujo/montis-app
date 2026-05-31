export interface EmergencyAlertLocation {
	latitude: number;
	longitude: number;
	address?: string;
}

export interface SendEmergencyAlertPayload {
	message: string;
	location?: EmergencyAlertLocation;
}

export interface EmergencyAlert {
	id: string;
	userId: string;
	message: string;
	location?: EmergencyAlertLocation;
	sentAt: string;
	status: string;
}
