import { Controller, Post, Body, UseGuards, Get, Put, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { GroupsService } from "./groups.service";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";

@ApiTags("Groups")
@Controller("groups")
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class GroupsController {
	constructor(private readonly groupsService: GroupsService) {}

	@Post("add-aa-group")
	@ApiOperation({ summary: "Add AA group to user's personal groups" })
	@ApiResponse({
		status: 200,
		description: "AA group added successfully",
		schema: {
			type: "object",
			properties: {
				message: { type: "string" },
				groupId: { type: "string" },
				groupName: { type: "string" },
				addedAt: { type: "string", format: "date-time" }
			}
		}
	})
	@ApiResponse({
		status: 400,
		description: "Validation error",
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized",
	})
	async addAAGroup(
		@CurrentUser() user: any,
		@Body() body: {
			groupId: string;
			notificationsEnabled: boolean;
		}
	) {
		try {
			const result = await this.groupsService.addAAGroup(user.uid, body);
			return {
				message: "Grupo AA adicionado com sucesso",
				groupId: result.groupId,
				addedAt: result.addedAt,
			};
		} catch (error) {
			console.error("Add AA group error:", error);
			throw new Error("Não foi possível adicionar o grupo AA");
		}
	}

	@Get("user-groups")
	@ApiOperation({ summary: "Get user's personal groups" })
	@ApiResponse({
		status: 200,
		description: "User groups retrieved successfully",
		schema: {
			type: "array",
			items: {
				type: "object",
				properties: {
					groupId: { type: "string" },
					groupName: { type: "string" },
					type: { type: "string" },
					address: { type: "string" },
					phone: { type: "string" },
					schedule: { type: "string" },
					distance: { type: "string" },
					meetingSchedules: {
						type: "array",
						items: {
							type: "object",
							properties: {
								day: { type: "string" },
								time: { type: "string" },
								enabled: { type: "boolean" }
							}
						}
					},
					notificationsEnabled: { type: "boolean" },
					addedAt: { type: "string", format: "date-time" }
				}
			}
		}
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized",
	})
	async getUserGroups(@CurrentUser() user: any) {
		try {
			const groups = await this.groupsService.getUserGroups(user.uid);
			return groups;
		} catch (error) {
			console.error("Get user groups error:", error);
			throw new Error("Não foi possível carregar os grupos do usuário");
		}
	}

	@Put("group/:groupId/notifications")
	@ApiOperation({ summary: "Update group notification preferences" })
	@ApiResponse({
		status: 200,
		description: "Notification preferences updated successfully",
	})
	@ApiResponse({
		status: 400,
		description: "Validation error",
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized",
	})
	async updateGroupNotifications(
		@CurrentUser() user: any,
		@Param('groupId') groupId: string,
		@Body() body: { notificationsEnabled: boolean }
	) {
		try {
			await this.groupsService.updateGroupNotifications(user.uid, groupId, body.notificationsEnabled);
			return {
				message: "Preferências de notificação atualizadas com sucesso",
			};
		} catch (error) {
			console.error("Update group notifications error:", error);
			throw new Error("Não foi possível atualizar as preferências de notificação");
		}
	}

	@Put("group/:groupId/schedules")
	@ApiOperation({ summary: "Update group meeting schedules" })
	@ApiResponse({
		status: 200,
		description: "Meeting schedules updated successfully",
	})
	@ApiResponse({
		status: 400,
		description: "Validation error",
	})
	@ApiResponse({
		status: 401,
		description: "Unauthorized",
	})
	async updateMeetingSchedules(
		@CurrentUser() user: any,
		@Param('groupId') groupId: string,
		@Body() body: { meetingSchedules: Array<{ day: string; time: string; enabled: boolean }> }
	) {
		try {
			await this.groupsService.updateMeetingSchedules(user.uid, groupId, body.meetingSchedules);
			return {
				message: "Horários de reunião atualizados com sucesso",
			};
		} catch (error) {
			console.error("Update meeting schedules error:", error);
			throw new Error("Não foi possível atualizar os horários de reunião");
		}
	}
}
