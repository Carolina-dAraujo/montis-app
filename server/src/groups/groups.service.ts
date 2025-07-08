import { Injectable } from "@nestjs/common";
import { FirebaseService } from "../firebase/firebase.service";

export interface AAGroup {
	id: string;
	name: string;
	address: string;
	city: string;
	neighborhood: string;
	online: boolean;
	monday?: string;
	tuesday?: string;
	wednesday?: string;
	thursday?: string;
	friday?: string;
	saturday?: string;
	sunday?: string;
}

@Injectable()
export class GroupsService {
	constructor(private readonly firebaseService: FirebaseService) { }

	async addAAGroup(userId: string, groupData: { groupId: string; notificationsEnabled: boolean }): Promise<{ groupId: string; addedAt: Date }> {
		try {
			const groupToSave = {
				groupId: groupData.groupId,
				notificationsEnabled: groupData.notificationsEnabled,
				addedAt: new Date(),
			};

			await this.firebaseService.saveUserData(userId, groupToSave, `groups/${groupData.groupId}`);

			return groupToSave;
		} catch (error) {
			console.error("Error adding AA group:", error);
			throw new Error("Failed to add AA group");
		}
	}

	async getUserGroups(userId: string): Promise<AAGroup[]> {
		try {
			const groupsData = await this.firebaseService.getUserData(userId, 'groups');

			if (!groupsData) {
				return [];
			}

			const groups: AAGroup[] = [];

			Object.keys(groupsData).forEach((groupId) => {
				const group = groupsData[groupId];
				groups.push({
					id: groupId,
					name: group.groupName,
					address: group.address,
					city: group.city,
					neighborhood: group.neighborhood,
					online: group.online || false,
					monday: group.monday || '',
					tuesday: group.tuesday || '',
					wednesday: group.wednesday || '',
					thursday: group.thursday || '',
					friday: group.friday || '',
					saturday: group.saturday || '',
					sunday: group.sunday || '',
				});
			});

			return groups;
		} catch (error) {
			console.error("Error getting user groups:", error);
			throw new Error("Failed to get user groups");
		}
	}

	async updateGroupNotifications(userId: string, groupId: string, notificationsEnabled: boolean): Promise<void> {
		try {
			await this.firebaseService.saveUserData(userId, { notificationsEnabled }, `groups/${groupId}`);
		} catch (error) {
			console.error("Error updating group notifications:", error);
			throw new Error("Failed to update group notifications");
		}
	}

	async getAllAAGroups(): Promise<AAGroup[]> {
		try {
			const groupsData = await this.firebaseService.getData('aa-groups');
			if (!groupsData) {
				return [];
			}
			const groups: AAGroup[] = Object.values(groupsData).map((group: any) => ({
				id: group.id || group.groupId,
				name: group.name || group.groupName,
				address: group.address,
				city: group.city,
				neighborhood: group.neighborhood,
				online: group.online || false,
				monday: group.monday || '',
				tuesday: group.tuesday || '',
				wednesday: group.wednesday || '',
				thursday: group.thursday || '',
				friday: group.friday || '',
				saturday: group.saturday || '',
				sunday: group.sunday || '',
			}));
			return groups;
		} catch (error) {
			console.error("Error getting all AA groups:", error);
			throw new Error("Failed to get all AA groups");
		}
	}
}
