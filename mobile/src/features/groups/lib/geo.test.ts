import { formatDistanceKm, haversineDistanceKm } from './geo';
import { getGroupDistanceKm, sortGroupsByNearMe } from './sortGroupsByNearMe';

describe('geo', () => {
	it('computes haversine distance between two points', () => {
		const recife = { latitude: -8.0476, longitude: -34.877 };
		const nearby = { latitude: -8.0448, longitude: -34.8791 };
		const distance = haversineDistanceKm(recife, nearby);

		expect(distance).toBeGreaterThan(0.3);
		expect(distance).toBeLessThan(0.5);
	});

	it('formats sub-kilometer distances in meters', () => {
		expect(formatDistanceKm(0.85)).toBe('850 m');
	});

	it('formats kilometer distances with pt-BR decimal', () => {
		expect(formatDistanceKm(1.2)).toBe('1,2 km');
	});
});

describe('sortGroupsByNearMe', () => {
	const userCoords = { latitude: -8.0476, longitude: -34.877 };

	const groups = [
		{
			id: 'far',
			name: 'Grupo Distante',
			type: 'in-person' as const,
			location: { latitude: -8.02, longitude: -34.91 },
		},
		{
			id: 'near',
			name: 'Grupo Perto',
			type: 'in-person' as const,
			location: { latitude: -8.0448, longitude: -34.8791 },
		},
		{
			id: 'virtual-b',
			name: 'Beta Online',
			type: 'virtual' as const,
		},
		{
			id: 'virtual-a',
			name: 'Alpha Online',
			type: 'virtual' as const,
		},
	];

	it('sorts in-person by distance and keeps virtual groups last alphabetically', () => {
		const sorted = sortGroupsByNearMe(groups, userCoords);

		expect(sorted.map((group) => group.id)).toEqual([
			'near',
			'far',
			'virtual-a',
			'virtual-b',
		]);
		expect(sorted[0].distanceKm).toBeLessThan(sorted[1].distanceKm ?? 0);
	});

	it('returns groups unchanged when user coords are missing', () => {
		const sorted = sortGroupsByNearMe(groups, null);
		expect(sorted).toHaveLength(groups.length);
		expect(sorted.every((group) => group.distanceKm == null)).toBe(true);
	});

	it('returns distance for in-person groups with location', () => {
		const distance = getGroupDistanceKm(groups[1], userCoords);
		expect(distance).not.toBeNull();
		expect(getGroupDistanceKm(groups[2], userCoords)).toBeNull();
	});

	it('excludes in-person groups beyond the max distance', () => {
		const sorted = sortGroupsByNearMe(groups, userCoords, 1);

		expect(sorted.map((group) => group.id)).toEqual(['near', 'virtual-a', 'virtual-b']);
	});
});
