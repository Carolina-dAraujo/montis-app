export type GeoCoordinates = {
	latitude: number;
	longitude: number;
};

/** Default radius for "Perto de mim" in-person group results. */
export const NEAR_ME_MAX_DISTANCE_KM = 10;

/** Expanded radius when no groups are found at the default distance. */
export const NEAR_ME_EXPANDED_DISTANCE_KM = 20;

const EARTH_RADIUS_KM = 6371;

export function haversineDistanceKm(from: GeoCoordinates, to: GeoCoordinates): number {
	const toRad = (deg: number) => (deg * Math.PI) / 180;
	const dLat = toRad(to.latitude - from.latitude);
	const dLon = toRad(to.longitude - from.longitude);
	const lat1 = toRad(from.latitude);
	const lat2 = toRad(to.latitude);

	const a =
		Math.sin(dLat / 2) ** 2
		+ Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

	return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistanceKm(distanceKm: number): string {
	if (distanceKm < 1) {
		const meters = Math.round(distanceKm * 1000);
		return `${meters} m`;
	}

	return `${distanceKm.toLocaleString('pt-BR', {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	})} km`;
}

export function normalizeCep(cep: string): string {
	return cep.replace(/\D/g, '');
}
