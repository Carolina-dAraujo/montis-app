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

/** True when fetch never reached the server (offline, wrong API_URL, backend down). */
export function isConnectivityError(error: unknown): boolean {
	const message = error instanceof Error ? error.message : String(error);
	return (
		message.includes('Network request failed')
		|| message.includes('Network request timed out')
		|| message.includes('Failed to fetch')
		|| message.includes('Não foi possível conectar ao servidor')
		|| message.includes('Servidor não respondeu a tempo')
		|| (error instanceof Error && error.name === 'AbortError')
	);
}

/** True when the server rejected the token (expired, invalid, etc.). */
export function isAuthError(error: unknown): boolean {
	const message = error instanceof Error ? error.message : String(error);
	return (
		message.includes('HTTP 401')
		|| message.toLowerCase().includes('unauthorized')
		|| message.toLowerCase().includes('invalid token')
		|| message.toLowerCase().includes('no token provided')
	);
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
		const mapped = mapNetworkError(error, baseUrl);
		if (isConnectivityError(mapped)) {
			console.warn('[API] Connectivity error:', url, mapped.message);
		} else {
			console.error('[API] Request failed:', url, mapped.message);
		}
		throw mapped;
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
