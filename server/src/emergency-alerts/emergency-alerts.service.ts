import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmergencyAlertDto } from './dtos';
import { EmergencyAlert } from './entities/emergency-alert.entity';
import { FirebaseService } from '../firebase/firebase.service';
import { EmergencyContactsService } from '../emergency-contacts/emergency-contacts.service';

@Injectable()
export class EmergencyAlertsService {
	constructor(
		private readonly firebaseService: FirebaseService,
		private readonly emergencyContactsService: EmergencyContactsService
	) { }

	async create(userId: string, createEmergencyAlertDto: CreateEmergencyAlertDto): Promise<EmergencyAlert> {
		const contacts = await this.emergencyContactsService.findAll(userId);
		const activeContacts = contacts.filter(contact => contact.isActive);

		if (activeContacts.length === 0) {
			throw new Error('Nenhum contato de emergência ativo encontrado');
		}

		const alertData = {
			...createEmergencyAlertDto,
			message: createEmergencyAlertDto.message || 'Preciso de ajuda urgente!',
			userId,
			contacts: activeContacts.map(c => c.id),
			status: 'sent' as const,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

		await this.firebaseService.saveUserData(userId, alertData, `emergency_alerts/${alertId}`);

		await this.sendSMSToContacts(activeContacts, createEmergencyAlertDto);

		return {
			id: alertId,
			...alertData,
		};
	}

	private async sendSMSToContacts(contacts: any[], alertData: CreateEmergencyAlertDto): Promise<void> {
		const message = this.formatEmergencyMessage(alertData);

		for (const contact of contacts) {
			try {
				// TODO: Replace with actual SMS service integration
				// Example with Twilio:
				// await this.twilioService.sendSMS(contact.phone, message);

				console.log(`SMS sent to ${contact.name} (${contact.phone}): ${message}`);

				// In production, you would:
				// 1. Use Twilio, AWS SNS, or similar SMS service
				// 2. Handle delivery status updates
				// 3. Retry failed messages
				// 4. Log all SMS activities

			} catch (error) {
				console.error(`Failed to send SMS to ${contact.name}:`, error);
			}
		}
	}

	private formatEmergencyMessage(alertData: CreateEmergencyAlertDto): string {
		let message = '🚨 ALERTA DE EMERGÊNCIA 🚨\n\n';
		message += 'Seu contato precisa de ajuda urgente!\n\n';

		if (alertData.message) {
			message += `Mensagem: ${alertData.message}\n\n`;
		}

		if (alertData.location) {
			message += `📍 Localização:\n`;
			if (alertData.location.address) {
				message += `${alertData.location.address}\n`;
			}
			message += `https://maps.google.com/?q=${alertData.location.latitude},${alertData.location.longitude}\n\n`;
		}

		message += 'Por favor, entre em contato imediatamente!\n';
		message += '---\n';
		message += 'Montis App';

		return message;
	}

	async findAll(userId: string): Promise<EmergencyAlert[]> {
		try {
			const alertsData = await this.firebaseService.getUserData(userId, 'emergency_alerts');

			if (!alertsData) {
				return [];
			}

			const alerts: EmergencyAlert[] = [];

			for (const [id, data] of Object.entries(alertsData)) {
				alerts.push({
					id,
					...(data as any),
				});
			}

			return alerts.sort((a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);
		} catch (error) {
			console.error('Error fetching emergency alerts:', error);
			return [];
		}
	}

	async findOne(userId: string, id: string): Promise<EmergencyAlert> {
		try {
			const alertData = await this.firebaseService.getUserData(userId, `emergency_alerts/${id}`);

			if (!alertData) {
				throw new NotFoundException('Emergency alert not found');
			}

			return {
				id,
				...alertData,
			} as EmergencyAlert;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new NotFoundException('Emergency alert not found');
		}
	}
}
