import { Controller, Get, Post, Body, UseGuards, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { SobrietyService, SobrietyData, Milestone } from "./sobriety.service";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
@ApiTags("Sobriety")
@Controller("sobriety")
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class SobrietyController {
	constructor(private readonly sobrietyService: SobrietyService) {}

	@Get("data")
	@ApiOperation({ summary: "Get user's sobriety data" })
	@ApiResponse({
		status: 200,
		description: "Sobriety data retrieved successfully",
		schema: {
			type: "object",
			properties: {
				userId: { type: "string" },
				startDate: { type: "string", format: "date-time" },
				lastDrinkDate: { type: "string", format: "date-time" },
				currentStreak: { type: "number" },
				totalDays: { type: "number" },
				milestones: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: { type: "string" },
							days: { type: "number" },
							achieved: { type: "boolean" },
							achievedDate: { type: "string", format: "date-time" },
							title: { type: "string" },
							description: { type: "string" }
						}
					}
				}
			}
		}
	})
	async getSobrietyData(@CurrentUser() user: any): Promise<SobrietyData> {
		const data = await this.sobrietyService.getUserSobrietyData(user.uid);
		if (!data) {
			throw new Error('Sobriety data not found');
		}
		return data;
	}

	@Get("milestones")
	@ApiOperation({ summary: "Get available sobriety milestones" })
	@ApiResponse({
		status: 200,
		description: "Milestones retrieved successfully",
		schema: {
			type: "array",
			items: {
				type: "object",
				properties: {
					id: { type: "string" },
					days: { type: "number" },
					achieved: { type: "boolean" },
					achievedDate: { type: "string", format: "date-time" },
					title: { type: "string" },
					description: { type: "string" }
				}
			}
		}
	})
	async getMilestones(): Promise<Milestone[]> {
		return await this.sobrietyService.getMilestones();
	}

	@Post("relapse")
	@ApiOperation({ summary: "Record a relapse" })
	@ApiResponse({
		status: 200,
		description: "Relapse recorded successfully"
	})
	async recordRelapse(
		@CurrentUser() user: any,
		@Body() body: { relapseDate: string }
	): Promise<SobrietyData> {
		const relapseDate = new Date(body.relapseDate);
		return await this.sobrietyService.recordRelapse(user.uid, relapseDate);
	}

	@Post("start")
	@ApiOperation({ summary: "Start sobriety tracking" })
	@ApiResponse({
		status: 200,
		description: "Sobriety tracking started successfully"
	})
	async startSobrietyTracking(
		@CurrentUser() user: any,
		@Body() body: { startDate: string }
	): Promise<SobrietyData> {
		const startDate = new Date(body.startDate);
		return await this.sobrietyService.updateSobrietyData(user.uid, {
			startDate,
			currentStreak: 0,
			totalDays: 0,
			milestones: []
		});
	}
}
