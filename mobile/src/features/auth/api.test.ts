import { authApi } from '@/features/auth/api';

describe('authApi', () => {
	it('logs in and returns token', async () => {
		const res = await authApi.login({ email: 'a@b.com', password: 'Secret1!' });
		expect(res.token).toBe('firebase-id-token-mock');
		expect(res.user.email).toBe('a@b.com');
	});
});
