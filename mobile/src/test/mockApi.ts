type MockHandler = (request: Request) => Promise<Response | null> | Response | null;

const base = 'http://localhost:3000';

export const mockApiHandlers: MockHandler[] = [
	async (request) => {
		if (
			request.method === 'POST'
			&& (request.url === `${base}/auth/login` || request.url === `${base}/auth/register`)
		) {
			return Response.json({
				token: 'firebase-id-token-mock',
				user: { uid: 'u1', email: 'a@b.com', displayName: 'Test' },
				message: 'ok',
			});
		}
		return null;
	},
	async (request) => {
		const match = request.url.match(new RegExp(`${base}/auth/tracking/(\\d{4}-\\d{2}-\\d{2})$`));
		if (request.method === 'GET' && match) {
			if (match[1] === '2024-06-01') {
				return Response.json({
					alcohol: 'none',
					exercise: 'light',
					mood: 'good',
					sleep: null,
				});
			}
			return Response.json(null);
		}
		return null;
	},
	async (request) => {
		const match = request.url.match(new RegExp(`${base}/auth/tracking/(\\d{4}-\\d{2}-\\d{2})$`));
		if (request.method === 'PUT' && match) {
			const body = await request.json();
			return Response.json(body);
		}
		return null;
	},
	async (request) => {
		if (request.method === 'GET' && request.url.startsWith(`${base}/auth/tracking/month`)) {
			return Response.json({
				'2024-06-01': { alcohol: 'none', exercise: 'light', mood: 'good' },
			});
		}
		return null;
	},
	async (request) => {
		if (request.method === 'GET' && request.url === `${base}/emergency-contacts`) {
			return Response.json([
				{
					id: 'c1',
					userId: 'u1',
					name: 'Maria',
					phone: '+5511999999999',
					relationship: 'Amiga',
					isActive: true,
					createdAt: '2024-01-01T00:00:00.000Z',
					updatedAt: '2024-01-01T00:00:00.000Z',
				},
			]);
		}
		return null;
	},
	async (request) => {
		if (request.method === 'GET' && request.url === `${base}/crisis-log`) {
			return Response.json([
				{
					id: 'e1',
					date: '2024-06-01',
					time: '14:30',
					severity: 'medium',
					triggers: 'stress',
					symptoms: 'anxiety',
					copingStrategies: 'breathing',
					notes: '',
				},
			]);
		}
		return null;
	},
	async (request) => {
		if (request.method === 'POST' && request.url === `${base}/crisis-log`) {
			const body = await request.json();
			return Response.json({
				id: 'e-new',
				date: '2024-06-02',
				time: '10:00',
				createdAt: '2024-06-02T10:00:00.000Z',
				updatedAt: '2024-06-02T10:00:00.000Z',
				notes: '',
				...body,
			});
		}
		return null;
	},
	async (request) => {
		if (request.method === 'GET' && request.url === `${base}/sobriety/data`) {
			return Response.json({
				userId: 'u1',
				startDate: '2024-01-01T00:00:00.000Z',
				currentStreak: 30,
				totalDays: 30,
				milestones: [],
			});
		}
		return null;
	},
];

export function installMockApi() {
	const originalFetch = global.fetch;

	global.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
		const request = new Request(input, init);
		for (const handler of mockApiHandlers) {
			const response = await handler(request);
			if (response) {
				return response;
			}
		}
		throw new Error(`Unhandled mock API request: ${request.method} ${request.url}`);
	}) as typeof fetch;

	return () => {
		global.fetch = originalFetch;
	};
}
