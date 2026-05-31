import { Injectable } from "@nestjs/common";
import { FirebaseService } from "../firebase/firebase.service";

export interface SobrietyData {
	userId: string;
	startDate: Date;
	lastDrinkDate?: Date;
	currentStreak: number;
	totalDays: number;
	milestones: Milestone[];
}

export interface Milestone {
	id: string;
	days: number;
	achieved: boolean;
	achievedDate?: Date;
	title: string;
	description: string;
}

const MILESTONE_DEFINITIONS: Omit<Milestone, 'achieved' | 'achievedDate'>[] = [
	{ id: '1', days: 1, title: 'Primeiro dia', description: 'Você completou seu primeiro dia de sobriedade!' },
	{ id: '2', days: 7, title: 'Uma semana', description: 'Uma semana completa de sobriedade!' },
	{ id: '3', days: 30, title: 'Um mês', description: 'Um mês de sobriedade! Você está incrível!' },
	{ id: '4', days: 90, title: 'Três meses', description: 'Três meses de sobriedade! Uma conquista incrível!' },
	{ id: '5', days: 180, title: 'Seis meses', description: 'Seis meses de sobriedade! Continue assim!' },
	{ id: '6', days: 365, title: 'Um ano', description: 'Um ano completo de sobriedade! Você é uma inspiração!' },
];

@Injectable()
export class SobrietyService {
	constructor(private readonly firebaseService: FirebaseService) {}

	private computeSobrietyDays(startDateStr?: string, lastDrinkDateStr?: string): number {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (startDateStr) {
			const start = new Date(startDateStr);
			start.setHours(0, 0, 0, 0);
			return Math.max(0, Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
		}

		if (lastDrinkDateStr) {
			const lastDrink = new Date(lastDrinkDateStr);
			lastDrink.setHours(0, 0, 0, 0);
			return Math.max(0, Math.ceil((today.getTime() - lastDrink.getTime()) / (1000 * 60 * 60 * 24)));
		}

		return 0;
	}

	private buildMilestones(totalDays: number, startDateStr?: string): Milestone[] {
		const startDate = startDateStr ? new Date(startDateStr) : new Date();

		return MILESTONE_DEFINITIONS.map((def) => {
			const achieved = totalDays >= def.days;
			let achievedDate: Date | undefined;

			if (achieved && def.days > 0) {
				achievedDate = new Date(startDate);
				achievedDate.setDate(achievedDate.getDate() + def.days);
			} else if (achieved && def.days === 0) {
				achievedDate = new Date(startDate);
			}

			return {
				...def,
				achieved,
				achievedDate,
			};
		});
	}

	async getUserSobrietyData(userId: string): Promise<SobrietyData | null> {
		const raw = await this.firebaseService.getSobrietyData(userId);

		if (!raw) {
			return null;
		}

		const startDateStr = raw.startDate as string | undefined;
		const lastDrinkDateStr = raw.lastDrinkDate as string | undefined;

		if (!startDateStr && !lastDrinkDateStr) {
			return null;
		}

		const totalDays = this.computeSobrietyDays(startDateStr, lastDrinkDateStr);
		const startDate = startDateStr
			? new Date(startDateStr)
			: lastDrinkDateStr
				? new Date(lastDrinkDateStr)
				: new Date();

		return {
			userId,
			startDate,
			lastDrinkDate: lastDrinkDateStr ? new Date(lastDrinkDateStr) : undefined,
			currentStreak: totalDays,
			totalDays,
			milestones: this.buildMilestones(totalDays, startDateStr ?? lastDrinkDateStr),
		};
	}

	async updateSobrietyData(userId: string, data: Partial<SobrietyData>): Promise<SobrietyData> {
		const currentData = await this.getUserSobrietyData(userId);
		if (!currentData) {
			throw new Error('Sobriety data not found');
		}

		const patch: Record<string, unknown> = {
			updatedAt: new Date().toISOString(),
		};

		if (data.startDate) {
			patch.startDate = data.startDate.toISOString().split('T')[0];
		}
		if (data.lastDrinkDate) {
			patch.lastDrinkDate = data.lastDrinkDate.toISOString().split('T')[0];
		}

		await this.firebaseService.saveSobrietyData(userId, {
			...patch,
			userId,
		});

		const updated = await this.getUserSobrietyData(userId);
		if (!updated) {
			throw new Error('Sobriety data not found after update');
		}

		return updated;
	}

	async recordRelapse(userId: string, relapseDate: Date): Promise<SobrietyData> {
		const relapseDateStr = relapseDate.toISOString().split('T')[0];

		await this.firebaseService.saveSobrietyData(userId, {
			userId,
			lastDrinkDate: relapseDateStr,
			currentStreak: 0,
			updatedAt: new Date().toISOString(),
		});

		const updated = await this.getUserSobrietyData(userId);
		if (!updated) {
			throw new Error('Sobriety data not found after relapse');
		}

		return {
			...updated,
			lastDrinkDate: relapseDate,
			currentStreak: 0,
		};
	}

	async getMilestones(): Promise<Milestone[]> {
		return MILESTONE_DEFINITIONS.map((def) => ({
			...def,
			achieved: false,
		}));
	}
}
