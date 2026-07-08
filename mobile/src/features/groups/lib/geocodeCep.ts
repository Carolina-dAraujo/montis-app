import { GeoCoordinates, normalizeCep } from '@/features/groups/lib/geo';

type BrasilApiCepResponse = {
	location?: {
		coordinates?: {
			latitude?: string | number;
			longitude?: string | number;
		};
	};
};

export async function geocodeCep(cep: string): Promise<GeoCoordinates | null> {
	const normalized = normalizeCep(cep);
	if (normalized.length !== 8) {
		return null;
	}

	try {
		const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${normalized}`);
		if (!response.ok) {
			return null;
		}

		const data = (await response.json()) as BrasilApiCepResponse;
		const latitude = Number(data.location?.coordinates?.latitude);
		const longitude = Number(data.location?.coordinates?.longitude);

		if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
			return null;
		}

		return { latitude, longitude };
	} catch {
		return null;
	}
}
