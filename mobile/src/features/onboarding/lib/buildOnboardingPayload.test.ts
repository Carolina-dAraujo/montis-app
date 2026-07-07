import { buildOnboardingPayload } from './buildOnboardingPayload';

describe('buildOnboardingPayload', () => {
	it('builds a valid sober payload', () => {
		const payload = buildOnboardingPayload({
			displayName: ' Maria ',
			birthDate: '1990-01-01T03:00:00.000Z',
			isCurrentlySober: true,
			sobrietyStartDate: '2024-01-01T03:00:00.000Z',
			sobrietyGoal: 'abstinence',
			dailyReminders: true,
			notificationFrequency: 'daily',
			crisisSupport: true,
			shareProgress: false,
		});

		expect(payload.displayName).toBe('Maria');
		expect(payload.birthDate).toBe('1990-01-01T03:00:00.000Z');
		expect(payload.sobrietyStartDate).toBe('2024-01-01T03:00:00.000Z');
		expect(payload.lastDrinkDate).toBeUndefined();
	});

	it('requires birthDate', () => {
		expect(() =>
			buildOnboardingPayload({
				displayName: 'Maria',
				isCurrentlySober: true,
				sobrietyStartDate: '2024-01-01T03:00:00.000Z',
			}),
		).toThrow('Data de nascimento é obrigatória');
	});
});
