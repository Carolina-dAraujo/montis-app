import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, Linking, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { groupsApi } from '@/features/groups/api';
import { storageService } from '@/shared/lib/storage';
import { LocationService } from '@/features/groups/lib/locationService';
import { AAGroup, useUserGroups } from '@/features/groups/hooks/useUserGroups';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const groupsData = require('@/data/groups.json');

export function useGroupDetail() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const { confirmRemoveGroup, removing } = useUserGroups();
	const [group, setGroup] = useState<AAGroup | null>(null);
	const [loading, setLoading] = useState(true);
	const shimmerAnim = useRef(new Animated.Value(0)).current;

	const loadGroupDetails = useCallback(async () => {
		try {
			setLoading(true);

			const foundGroup = groupsData.groups.find((g: AAGroup) => g.id === id);

			if (!foundGroup) {
				Alert.alert('Erro', 'Grupo não encontrado');
				router.back();
				return;
			}

			const token = await storageService.getAuthToken();

			if (token) {
				try {
					const meetingNotifications = await groupsApi.getMeetingNotifications(token, foundGroup.id);
					const updatedGroup = { ...foundGroup };

					if (updatedGroup.schedule) {
						Object.keys(updatedGroup.schedule).forEach((day) => {
							if (updatedGroup.schedule[day]) {
								updatedGroup.schedule[day] = updatedGroup.schedule[day].map(
									(meeting: { start: string; end: string; notificationsEnabled?: boolean }, index: number) => ({
										...meeting,
										notificationsEnabled: Boolean(
											meetingNotifications[day]?.[index]
											?? meetingNotifications[day]?.[String(index)],
										),
									})
								);
							}
						});
					}

					setGroup(updatedGroup);
				} catch (error) {
					console.error('Error loading meeting notifications:', error);
					setGroup(foundGroup);
				}
			} else {
				setGroup(foundGroup);
			}
		} catch (error) {
			Alert.alert('Erro', 'Não foi possível carregar os detalhes do grupo');
			router.back();
		} finally {
			setLoading(false);
		}
	}, [id, router]);

	useEffect(() => {
		loadGroupDetails();
	}, [loadGroupDetails]);

	useEffect(() => {
		if (!loading) {
			return;
		}

		const shimmerAnimation = Animated.loop(
			Animated.sequence([
				Animated.timing(shimmerAnim, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(shimmerAnim, {
					toValue: 0,
					duration: 1000,
					useNativeDriver: true,
				}),
			])
		);
		shimmerAnimation.start();
		return () => shimmerAnimation.stop();
	}, [loading, shimmerAnim]);

	const handleNotificationToggle = useCallback(async (enabled: boolean) => {
		if (!group) {
			return;
		}

		try {
			const token = await storageService.getAuthToken();
			if (!token) {
				return;
			}

			await groupsApi.updateGroupNotifications(token, group.id, enabled);
			setGroup((prev) => (prev ? { ...prev, notificationsEnabled: enabled } : null));
		} catch (error) {
			console.error('Error updating notification preferences:', error);
			Alert.alert('Erro', 'Não foi possível atualizar as preferências de notificação');
		}
	}, [group]);

	const handleMeetingNotificationToggle = useCallback(async (
		groupId: string,
		day: string,
		meetingIndex: number,
		enabled: boolean,
	) => {
		setGroup((prev) => {
			if (!prev) {
				return null;
			}

			const schedule = { ...prev.schedule };
			const dayMeetings = [...(schedule[day] ?? [])];
			const meeting = dayMeetings[meetingIndex];
			if (!meeting) {
				return prev;
			}

			dayMeetings[meetingIndex] = { ...meeting, notificationsEnabled: enabled };
			schedule[day] = dayMeetings;
			return { ...prev, schedule };
		});

		try {
			const token = await storageService.getAuthToken();
			if (!token) {
				throw new Error('Usuário não autenticado');
			}

			await groupsApi.updateMeetingNotification(token, groupId, day, meetingIndex, enabled);
		} catch (error) {
			setGroup((prev) => {
				if (!prev) {
					return null;
				}

				const schedule = { ...prev.schedule };
				const dayMeetings = [...(schedule[day] ?? [])];
				const meeting = dayMeetings[meetingIndex];
				if (!meeting) {
					return prev;
				}

				dayMeetings[meetingIndex] = { ...meeting, notificationsEnabled: !enabled };
				schedule[day] = dayMeetings;
				return { ...prev, schedule };
			});
			console.error('Error updating meeting notification:', error);
			Alert.alert('Erro', 'Não foi possível atualizar as notificações da reunião');
		}
	}, []);

	const handleCall = useCallback(() => {
		if (group?.link) {
			Linking.openURL(group.link);
		}
	}, [group]);

	const copyAddress = useCallback(() => {
		if (group) {
			LocationService.copyAddress(group.address);
		}
	}, [group]);

	const openInMaps = useCallback(() => {
		if (group) {
			LocationService.openInMaps(group.address);
		}
	}, [group]);

	const openInGoogleMaps = useCallback(() => {
		if (group) {
			LocationService.openInGoogleMaps(group.address);
		}
	}, [group]);

	const openInWaze = useCallback(() => {
		if (group) {
			LocationService.openInWaze(group.address);
		}
	}, [group]);

	const handleRemoveGroup = useCallback(() => {
		if (!group) {
			return;
		}

		confirmRemoveGroup(group, () => router.back());
	}, [group, confirmRemoveGroup, router]);

	return {
		group,
		loading,
		removing,
		shimmerAnim,
		handleNotificationToggle,
		handleMeetingNotificationToggle,
		handleCall,
		copyAddress,
		openInMaps,
		openInGoogleMaps,
		openInWaze,
		handleRemoveGroup,
		goBack: () => router.back(),
	};
}
