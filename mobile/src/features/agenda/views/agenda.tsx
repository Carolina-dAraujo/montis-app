import CalendarList from '@/features/agenda/components/calendar';
import { router } from 'expo-router';
import React, { useState, useMemo } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { trackingApi } from '@/features/tracking/api';
import { trackingQueryKeys } from '@/features/tracking/queryKeys';
import { storageService } from '@/shared/lib/storage';
import { getTabBarScrollPadding } from '@/shared/components/ui/tabBarMetrics';
import { styles } from '@/features/agenda/styles/agenda.styles';

function monthTrackedDays(monthData: Record<string, unknown>): string[] {
	return Object.keys(monthData).map((dateStr) => {
		const [y, m, d] = dateStr.split('-').map(Number);
		return new Date(y, m - 1, d).toDateString();
	});
}

export default function Agenda() {
	const insets = useSafeAreaInsets();
	const [selectedDate, setSelectedDate] = useState(new Date());
	const queryClient = useQueryClient();
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1;

	const monthQuery = useQuery({
		queryKey: trackingQueryKeys.month(year, month),
		queryFn: async () => {
			const token = await storageService.getAuthToken();
			if (!token) return {};
			return trackingApi.getDailyTrackingMonth(token, year, month);
		},
	});

	const trackedDays = useMemo(
		() => monthTrackedDays(monthQuery.data ?? {}),
		[monthQuery.data],
	);

	useFocusEffect(
		React.useCallback(() => {
			queryClient.invalidateQueries({
				queryKey: trackingQueryKeys.month(year, month),
			});
		}, [queryClient, year, month]),
	);

	const handleDateSelect = (date: Date) => {
		setSelectedDate(date);
		router.push({ pathname: '/tracking/[date]', params: { date: date.toISOString() } });
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Agenda</Text>
			</View>

			<CalendarList
				selectedDate={selectedDate}
				onDateSelect={handleDateSelect}
				trackedDays={trackedDays}
				contentPaddingBottom={getTabBarScrollPadding(insets.bottom)}
			/>
		</SafeAreaView>
	);
}
