import { mapNetworkError } from './client';

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
