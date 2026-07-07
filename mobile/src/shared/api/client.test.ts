import { mapNetworkError, buildFetchInit, parseResponseJson } from './client';

describe('mapNetworkError', () => {
	it('maps abort errors to timeout message', () => {
		const error = new Error('Aborted');
		error.name = 'AbortError';
		const mapped = mapNetworkError(error, 'http://localhost:3000');
		expect(mapped.message).toContain('Servidor não respondeu a tempo');
	});

	it('maps network failures to connection message', () => {
		const mapped = mapNetworkError(new TypeError('Network request timed out'), 'http://localhost:3000');
		expect(mapped.message).toContain('Não foi possível conectar');
	});
});

describe('buildFetchInit', () => {
	it('keeps Content-Type when auth headers are provided', () => {
		const init = buildFetchInit({
			method: 'POST',
			body: '{"ok":true}',
			headers: {
				Authorization: 'Bearer token',
			},
		});

		expect(init.headers).toEqual({
			'Content-Type': 'application/json',
			Authorization: 'Bearer token',
		});
	});
});

describe('parseResponseJson', () => {
	it('returns null for empty success body', async () => {
		const response = new Response('', { status: 200 });
		await expect(parseResponseJson(response)).resolves.toBeNull();
	});

	it('parses JSON null', async () => {
		const response = new Response('null', { status: 200 });
		await expect(parseResponseJson(response)).resolves.toBeNull();
	});

	it('parses JSON objects', async () => {
		const response = new Response('{"alcohol":"none"}', { status: 200 });
		await expect(parseResponseJson(response)).resolves.toEqual({ alcohol: 'none' });
	});
});
