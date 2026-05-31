import { sobrietyApi } from '@/features/sobriety/api';

describe('sobrietyApi', () => {
	it('fetches sobriety data', async () => {
		const data = await sobrietyApi.getData('test-token');
		expect(data.totalDays).toBe(30);
		expect(data.userId).toBe('u1');
	});
});
