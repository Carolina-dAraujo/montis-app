import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateEmergencyContactDto, UpdateEmergencyContactDto } from './dtos';
import { EmergencyContact } from './entities/emergency-contact.entity';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class EmergencyContactsService {
	constructor(private readonly firebaseService: FirebaseService) { }

	async create(userId: string, createEmergencyContactDto: CreateEmergencyContactDto): Promise<EmergencyContact> {
		const contactData = {
			...createEmergencyContactDto,
			userId,
			isActive: createEmergencyContactDto.isActive ?? true,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		const contactId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

		await this.firebaseService.saveUserData(userId, contactData, `emergency_contacts/${contactId}`);

		return {
			id: contactId,
			...contactData,
		};
	}

	async findAll(userId: string): Promise<EmergencyContact[]> {
		try {
			const contactsData = await this.firebaseService.getUserData(userId, 'emergency_contacts');

			if (!contactsData) {
				return [];
			}

			const contacts: EmergencyContact[] = [];

			for (const [id, data] of Object.entries(contactsData)) {
				contacts.push({
					id,
					...(data as any),
				});
			}

			return contacts.sort((a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);
		} catch (error) {
			console.error('Error fetching emergency contacts:', error);
			return [];
		}
	}

	async findOne(userId: string, id: string): Promise<EmergencyContact> {
		try {
			const contactData = await this.firebaseService.getUserData(userId, `emergency_contacts/${id}`);

			if (!contactData) {
				throw new NotFoundException('Emergency contact not found');
			}

			return {
				id,
				...contactData,
			} as EmergencyContact;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new NotFoundException('Emergency contact not found');
		}
	}

	async update(userId: string, id: string, updateEmergencyContactDto: UpdateEmergencyContactDto): Promise<EmergencyContact> {
		await this.findOne(userId, id);

		const updateData = {
			...updateEmergencyContactDto,
			updatedAt: new Date().toISOString(),
		};

		await this.firebaseService.saveUserData(userId, updateData, `emergency_contacts/${id}`);

		return this.findOne(userId, id);
	}

	async remove(userId: string, id: string): Promise<void> {
		await this.findOne(userId, id);

		await this.firebaseService.deleteUserData(userId, `emergency_contacts/${id}`);
	}

	async toggleActive(userId: string, id: string): Promise<EmergencyContact> {
		const contact = await this.findOne(userId, id);

		return this.update(userId, id, {
			isActive: !contact.isActive,
		});
	}
}
