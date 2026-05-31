import { trackingApi } from '@/features/tracking/api';

describe('trackingApi', () => {
	it('loads tracking for a date', async () => {
		const data = await trackingApi.getDailyTracking('test-token', '2024-06-01');
		expect(data).toMatchObject({ alcohol: 'none', mood: 'good' });
	});

	it('returns null when no entry exists', async () => {
		const data = await trackingApi.getDailyTracking('test-token', '2099-01-01');
		expect(data).toBeNull();
	});

	it('saves tracking for a date', async () => {
		const payload = {
			alcohol: 'none' as const,
			exercise: 'moderate' as const,
			mood: 'neutral' as const,
			sleep: null,
		};
		const saved = await trackingApi.saveDailyTracking('test-token', '2024-06-02', payload);
		expect(saved).toEqual(payload);
	});

	it('loads month summary', async () => {
		const month = await trackingApi.getDailyTrackingMonth('test-token', 2024, 6);
		expect(Object.keys(month)).toContain('2024-06-01');
	});
});
