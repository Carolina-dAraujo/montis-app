import { Injectable } from "@nestjs/common";
import { FirebaseService } from "../firebase/firebase.service";

export interface MeetingSchedule {
	day: string;
	time: string;
	enabled: boolean;
}

export interface AAGroup {
	groupId: string;
	groupName: string;
	address: string;
	phone: string;
	schedule: string;
	type: 'online' | 'in-person' | 'hybrid';
	distance: string;
	meetingSchedules: MeetingSchedule[];
	notificationsEnabled: boolean;
	addedAt: Date;
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
					groupId,
					groupName: group.groupName,
					address: group.address,
					phone: group.phone,
					schedule: group.schedule,
					type: group.type,
					distance: group.distance,
					meetingSchedules: group.meetingSchedules || [],
					notificationsEnabled: group.notificationsEnabled || false,
					addedAt: new Date(group.addedAt),
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

	async updateMeetingSchedules(userId: string, groupId: string, meetingSchedules: MeetingSchedule[]): Promise<void> {
		try {
			await this.firebaseService.saveUserData(userId, { meetingSchedules }, `groups/${groupId}`);
		} catch (error) {
			console.error("Error updating meeting schedules:", error);
			throw new Error("Failed to update meeting schedules");
		}
	}
}
