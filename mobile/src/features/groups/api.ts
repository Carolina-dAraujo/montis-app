import { request, requestAuth } from '@/shared/api/client';

export const groupsApi = {
	getUserGroups: (token: string) =>
		requestAuth<Array<{ id: string; notificationsEnabled: boolean; addedAt: string }>>(
			'/groups/user-groups',
			token,
			{ method: 'GET' }
		),

	addAAGroup: (
		token: string,
		groupData: { groupId: string; notificationsEnabled: boolean }
	) =>
		requestAuth<{ message: string; groupId: string; addedAt: string }>(
			'/groups/add-aa-group',
			token,
			{ method: 'POST', body: JSON.stringify(groupData) }
		),

	updateGroupNotifications: (token: string, groupId: string, notificationsEnabled: boolean) =>
		requestAuth<{ message: string }>(`/groups/group/${groupId}/notifications`, token, {
			method: 'PUT',
			body: JSON.stringify({ notificationsEnabled }),
		}),

	updateMeetingNotification: (
		token: string,
		groupId: string,
		day: string,
		meetingIndex: number,
		notificationsEnabled: boolean
	) =>
		requestAuth<{ message: string }>(
			`/groups/group/${groupId}/meeting/${day}/${meetingIndex}/notifications`,
			token,
			{ method: 'PUT', body: JSON.stringify({ notificationsEnabled }) }
		),

	getMeetingNotifications: (token: string, groupId: string) =>
		requestAuth<{ [day: string]: { [index: number]: boolean } }>(
			`/groups/group/${groupId}/meeting-notifications`,
			token,
			{ method: 'GET' }
		),

	getAllAAGroups: () => request<unknown[]>('/groups/all-aa-groups'),
};
