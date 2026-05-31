import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateCrisisLogEntryDto, UpdateCrisisLogEntryDto } from './dtos';
import { CrisisLogEntry } from './entities/crisis-log-entry.entity';

@Injectable()
export class CrisisLogService {
	constructor(private readonly firebaseService: FirebaseService) {}

	private entryPath(id: string): string {
		return `crisisLog/${id}`;
	}

	async findAll(userId: string): Promise<CrisisLogEntry[]> {
		try {
			const entriesData = await this.firebaseService.getUserData(userId, 'crisisLog');

			if (!entriesData) {
				return [];
			}

			const entries: CrisisLogEntry[] = [];

			for (const [id, data] of Object.entries(entriesData)) {
				entries.push({
					id,
					...(data as Omit<CrisisLogEntry, 'id'>),
				});
			}

			return entries.sort(
				(a, b) =>
					new Date(`${b.date}T${b.time}`).getTime() -
					new Date(`${a.date}T${a.time}`).getTime(),
			);
		} catch (error) {
			console.error('Error fetching crisis log entries:', error);
			return [];
		}
	}

	async create(userId: string, dto: CreateCrisisLogEntryDto): Promise<CrisisLogEntry> {
		const now = new Date();
		const date = dto.date ?? now.toISOString().split('T')[0];
		const time =
			dto.time ?? now.toTimeString().split(' ')[0].substring(0, 5);
		const createdAt = now.toISOString();

		const entryId = `crisis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

		const entryData = {
			date,
			time,
			severity: dto.severity,
			triggers: dto.triggers,
			symptoms: dto.symptoms,
			copingStrategies: dto.copingStrategies,
			notes: dto.notes ?? '',
			createdAt,
			updatedAt: createdAt,
		};

		await this.firebaseService.saveUserData(userId, entryData, this.entryPath(entryId));

		return {
			id: entryId,
			...entryData,
		};
	}

	async findOne(userId: string, id: string): Promise<CrisisLogEntry> {
		const entryData = await this.firebaseService.getUserData(userId, this.entryPath(id));

		if (!entryData) {
			throw new NotFoundException('Crisis log entry not found');
		}

		return {
			id,
			...(entryData as Omit<CrisisLogEntry, 'id'>),
		};
	}

	async update(
		userId: string,
		id: string,
		dto: UpdateCrisisLogEntryDto,
	): Promise<CrisisLogEntry> {
		const existing = await this.findOne(userId, id);

		const { id: _, ...withoutId } = existing;
		const updateData = {
			...withoutId,
			...dto,
			notes: dto.notes !== undefined ? dto.notes : existing.notes,
			updatedAt: new Date().toISOString(),
		};

		await this.firebaseService.saveUserData(userId, updateData, this.entryPath(id));

		return {
			id,
			...updateData,
		};
	}

	async remove(userId: string, id: string): Promise<void> {
		await this.findOne(userId, id);
		await this.firebaseService.deleteUserData(userId, this.entryPath(id));
	}
}
