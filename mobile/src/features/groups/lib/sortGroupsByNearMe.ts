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

export function sortGroupsByNearMe<T extends NearMeGroup>(
	groups: T[],
	userCoords: GeoCoordinates | null,
	maxDistanceKm: number = NEAR_ME_MAX_DISTANCE_KM,
): NearMeGroupWithDistance<T>[] {
	if (!userCoords) {
		return groups.map((group) => ({ ...group }));
	}

	const withDistance: NearMeGroupWithDistance<T>[] = groups.map((group) => {
		if (group.type !== 'in-person' || !group.location) {
			return { ...group };
		}

		return {
			...group,
			distanceKm: haversineDistanceKm(userCoords, group.location),
		};
	});

	const inPersonWithDistance = withDistance
		.filter(
			(group) =>
				group.type === 'in-person'
				&& group.distanceKm != null
				&& group.distanceKm <= maxDistanceKm,
		)
		.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));

	const inPersonWithoutDistance = withDistance
		.filter((group) => group.type === 'in-person' && group.distanceKm == null)
		.sort(compareByName);

	const virtualGroups = withDistance
		.filter((group) => group.type === 'virtual')
		.sort(compareByName);

	return [...inPersonWithDistance, ...inPersonWithoutDistance, ...virtualGroups];
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
