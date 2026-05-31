import { requestAuth } from '@/shared/api/client';

export interface DailyTrackingRecord {
	alcohol: 'none' | 'light' | 'moderate' | 'heavy';
	exercise: 'none' | 'light' | 'moderate' | 'intense';
	mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
	sleep?: number | null;
}

export const trackingApi = {
	getDailyTracking: (token: string, date: string) =>
		requestAuth<DailyTrackingRecord | null>(`/auth/tracking/${date}`, token, { method: 'GET' }),

	saveDailyTracking: (token: string, date: string, data: DailyTrackingRecord) =>
		requestAuth<DailyTrackingRecord>(`/auth/tracking/${date}`, token, {
			method: 'PUT',
			body: JSON.stringify(data),
		}),

	/** @param month Calendar month 1–12 */
	getDailyTrackingMonth: (token: string, year: number, month: number) =>
		requestAuth<Record<string, DailyTrackingRecord>>(
			`/auth/tracking/month?year=${year}&month=${month}`,
			token,
			{ method: 'GET' },
		),
};
