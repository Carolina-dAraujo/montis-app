import { crisisLogApi } from '@/features/crisisSupport/api';

describe('crisisLogApi', () => {
	it('lists crisis log entries', async () => {
		const entries = await crisisLogApi.list('test-token');
		expect(entries).toHaveLength(1);
		expect(entries[0].severity).toBe('medium');
	});

	it('creates a crisis log entry', async () => {
		const entry = await crisisLogApi.create('test-token', {
			severity: 'low',
			triggers: 'work',
			symptoms: 'tension',
			copingStrategies: 'walk',
			notes: '',
		});
		expect(entry.id).toBe('e-new');
		expect(entry.triggers).toBe('work');
	});
});
