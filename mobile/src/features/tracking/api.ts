import { requestAuth } from '@/shared/api/client';

export const trackingApi = {
	getDailyTracking: (token: string, date: string) =>
		requestAuth<unknown>(`/auth/tracking/${date}`, token, { method: 'GET' }),

	saveDailyTracking: (token: string, date: string, data: unknown) =>
		requestAuth<unknown>(`/auth/tracking/${date}`, token, {
			method: 'PUT',
			body: JSON.stringify(data),
		}),
};
