import {
	haversineDistanceKm,
	NEAR_ME_MAX_DISTANCE_KM,
	type GeoCoordinates,
} from '@/features/groups/lib/geo';

export type NearMeGroup = {
	id: string;
	name: string;
	type: 'virtual' | 'in-person';
	location?: GeoCoordinates;
};

export type NearMeGroupWithDistance<T extends NearMeGroup = NearMeGroup> = T & {
	distanceKm?: number;
};

function compareByName(a: NearMeGroup, b: NearMeGroup): number {
	return a.name.localeCompare(b.name, 'pt-BR');
}

/**
 * Returns only in-person groups within maxDistanceKm, sorted nearest first.
 * Groups without coordinates are excluded when user location is available.
 */
export function sortGroupsByNearMe<T extends NearMeGroup>(
	groups: T[],
	userCoords: GeoCoordinates | null,
	maxDistanceKm: number = NEAR_ME_MAX_DISTANCE_KM,
): NearMeGroupWithDistance<T>[] {
	const inPersonGroups = groups.filter((group) => group.type === 'in-person');

	if (!userCoords) {
		return inPersonGroups
			.sort(compareByName)
			.map((group) => ({ ...group }));
	}

	return inPersonGroups
		.filter((group) => group.location != null)
		.map((group) => ({
			...group,
			distanceKm: haversineDistanceKm(userCoords, group.location!),
		}))
		.filter((group) => group.distanceKm <= maxDistanceKm)
		.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
}

export function getGroupDistanceKm(
	group: NearMeGroup,
	userCoords: GeoCoordinates | null,
): number | null {
	if (!userCoords || group.type !== 'in-person' || !group.location) {
		return null;
	}

	return haversineDistanceKm(userCoords, group.location);
}
