import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trackingApi, type DailyTrackingRecord } from '@/features/tracking/api';
import { trackingQueryKeys } from '@/features/tracking/queryKeys';
import { storageService } from '@/shared/lib/storage';

async function getTokenOrThrow(): Promise<string> {
	const token = await storageService.getAuthToken();
	if (!token) throw new Error('Token não disponível');
	return token;
}

export function formatTrackingDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}

export function useDailyTracking(selectedDate: Date) {
	const dateKey = formatTrackingDate(selectedDate);
	const year = selectedDate.getFullYear();
	const month = selectedDate.getMonth() + 1;
	const queryClient = useQueryClient();

	const dailyQuery = useQuery({
		queryKey: trackingQueryKeys.daily(dateKey),
		queryFn: async () => {
			const token = await getTokenOrThrow();
			return trackingApi.getDailyTracking(token, dateKey);
		},
	});

	const monthQuery = useQuery({
		queryKey: trackingQueryKeys.month(year, month),
		queryFn: async () => {
			const token = await getTokenOrThrow();
			return trackingApi.getDailyTrackingMonth(token, year, month);
		},
	});

	const saveMutation = useMutation({
		mutationFn: async (record: DailyTrackingRecord) => {
			const token = await getTokenOrThrow();
			return trackingApi.saveDailyTracking(token, dateKey, record);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: trackingQueryKeys.daily(dateKey) });
			queryClient.invalidateQueries({ queryKey: trackingQueryKeys.month(year, month) });
		},
	});

	return {
		dailyData: dailyQuery.data,
		monthData: monthQuery.data ?? {},
		isLoading: dailyQuery.isPending,
		isSaving: saveMutation.isPending,
		saveTracking: saveMutation.mutateAsync,
		refetchDaily: dailyQuery.refetch,
	};
}
