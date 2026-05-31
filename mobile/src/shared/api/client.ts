import { getApiUrl } from './getApiUrl';

export const REQUEST_TIMEOUT_MS = 15_000;

export interface ApiError {
	message: string;
	code?: string;
}

export function mapNetworkError(error: unknown, baseUrl: string): Error {
	const message = error instanceof Error ? error.message : String(error);

	if (error instanceof Error && error.name === 'AbortError') {
		return new Error(
			`Servidor não respondeu a tempo (${baseUrl}). Confira se o backend está rodando e se API_URL no .env usa o IP do seu Mac (npm run api:url).`
		);
	}

	if (
		message.includes('Network request failed')
		|| message.includes('Network request timed out')
		|| message.includes('Failed to fetch')
	) {
		return new Error(
			`Não foi possível conectar ao servidor (${baseUrl}). Rode o backend, use o mesmo Wi‑Fi e atualize API_URL (npm run api:url).`
		);
	}

	return error instanceof Error ? error : new Error(message);
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const baseUrl = getApiUrl();
	const url = `${baseUrl}${endpoint}`;
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

	try {
		const response = await fetch(url, {
			headers: { 'Content-Type': 'application/json', ...options.headers },
			...options,
			signal: controller.signal,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: 'Network error' }));
			throw new Error(errorData.message || `HTTP ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('[API] Request failed:', url, error);
		throw mapNetworkError(error, baseUrl);
	} finally {
		clearTimeout(timeoutId);
	}
}

export async function requestAuth<T>(
	endpoint: string,
	token: string,
	options: RequestInit = {}
): Promise<T> {
	return request<T>(endpoint, {
		...options,
		headers: {
			Authorization: `Bearer ${token}`,
			...options.headers,
		},
	});
}

export function getBaseUrl(): string {
	return getApiUrl();
}
