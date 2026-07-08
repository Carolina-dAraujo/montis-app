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

export function buildFetchInit(options: RequestInit = {}): RequestInit {
	return {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options.headers,
		},
	};
}

function parseApiErrorMessage(errorData: unknown, status: number): string {
	if (!errorData || typeof errorData !== 'object') {
		return `HTTP ${status}`;
	}

	const body = errorData as {
		message?: string | { message?: string; errors?: string[] };
		errors?: string[];
	};

	if (Array.isArray(body.errors) && body.errors.length > 0) {
		return body.errors.join('; ');
	}

	if (body.message && typeof body.message === 'object') {
		const nested = body.message;
		if (Array.isArray(nested.errors) && nested.errors.length > 0) {
			return nested.errors.join('; ');
		}
		if (nested.message) {
			return nested.message;
		}
	}

	if (typeof body.message === 'string') {
		return body.message;
	}

	return `HTTP ${status}`;
}

/** Parses JSON body; empty 200 responses become null (NestJS returns no body for null). */
export async function parseResponseJson<T>(response: Response): Promise<T> {
	const text = await response.text();
	if (!text.trim()) {
		return null as T;
	}
	return JSON.parse(text) as T;
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const baseUrl = getApiUrl();
	const url = `${baseUrl}${endpoint}`;
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

	try {
		const response = await fetch(url, {
			...buildFetchInit(options),
			signal: controller.signal,
		});

		const text = await response.text();

		if (!response.ok) {
			let errorData: unknown;
			try {
				errorData = text.trim() ? JSON.parse(text) : { message: `HTTP ${response.status}` };
			} catch {
				errorData = { message: text || `HTTP ${response.status}` };
			}
			throw new Error(parseApiErrorMessage(errorData, response.status));
		}

		if (!text.trim()) {
			return null as T;
		}

		return JSON.parse(text) as T;
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
	try {
		return await request<T>(endpoint, {
			...options,
			headers: {
				Authorization: `Bearer ${token}`,
				...options.headers,
			},
		});
	} catch (error) {
		if (!isAuthError(error)) {
			throw error;
		}

		const { refreshAuthSession } = await import('@/features/auth/session');
		const newToken = await refreshAuthSession();
		if (!newToken) {
			throw error;
		}

		return request<T>(endpoint, {
			...options,
			headers: {
				Authorization: `Bearer ${newToken}`,
				...options.headers,
			},
		});
	}
}

export function getBaseUrl(): string {
	return getApiUrl();
}
