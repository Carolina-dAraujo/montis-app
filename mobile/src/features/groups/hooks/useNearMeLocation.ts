import { useCallback, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { geocodeCep } from '@/features/groups/lib/geocodeCep';
import type { GeoCoordinates } from '@/features/groups/lib/geo';
import { usePreferences } from '@/features/settings/hooks/usePreferences';

export type NearMeLocationSource = 'gps' | 'cep';

type NearMeLocationState = {
	coords: GeoCoordinates | null;
	loading: boolean;
	error: string | null;
	source: NearMeLocationSource | null;
};

let cachedCoords: GeoCoordinates | null = null;
let cachedSource: NearMeLocationSource | null = null;

export function useNearMeLocation() {
	const { preferences } = usePreferences();
	const [state, setState] = useState<NearMeLocationState>({
		coords: cachedCoords,
		loading: false,
		error: null,
		source: cachedSource,
	});
	const inFlightRef = useRef<Promise<GeoCoordinates | null> | null>(null);

	const resolveFromCep = useCallback(async (): Promise<GeoCoordinates | null> => {
		const cep = preferences?.cep?.trim();
		if (!cep) {
			return null;
		}

		return geocodeCep(cep);
	}, [preferences?.cep]);

	const requestLocation = useCallback(async (): Promise<GeoCoordinates | null> => {
		if (cachedCoords) {
			setState({
				coords: cachedCoords,
				loading: false,
				error: null,
				source: cachedSource,
			});
			return cachedCoords;
		}

		if (inFlightRef.current) {
			return inFlightRef.current;
		}

		setState((prev) => ({ ...prev, loading: true, error: null }));

		inFlightRef.current = (async () => {
			try {
				const { status } = await Location.requestForegroundPermissionsAsync();
				if (status === 'granted') {
					const position = await Location.getCurrentPositionAsync({
						accuracy: Location.Accuracy.Balanced,
					});

					const coords: GeoCoordinates = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					};

					cachedCoords = coords;
					cachedSource = 'gps';
					setState({
						coords,
						loading: false,
						error: null,
						source: 'gps',
					});
					return coords;
				}

				const cepCoords = await resolveFromCep();
				if (cepCoords) {
					cachedCoords = cepCoords;
					cachedSource = 'cep';
					setState({
						coords: cepCoords,
						loading: false,
						error: null,
						source: 'cep',
					});
					return cepCoords;
				}

				setState({
					coords: null,
					loading: false,
					error: 'Ative localização ou adicione CEP no perfil',
					source: null,
				});
				return null;
			} catch {
				const cepCoords = await resolveFromCep();
				if (cepCoords) {
					cachedCoords = cepCoords;
					cachedSource = 'cep';
					setState({
						coords: cepCoords,
						loading: false,
						error: null,
						source: 'cep',
					});
					return cepCoords;
				}

				setState({
					coords: null,
					loading: false,
					error: 'Ative localização ou adicione CEP no perfil',
					source: null,
				});
				return null;
			} finally {
				inFlightRef.current = null;
			}
		})();

		return inFlightRef.current;
	}, [resolveFromCep]);

	const clearLocation = useCallback(() => {
		cachedCoords = null;
		cachedSource = null;
		setState({
			coords: null,
			loading: false,
			error: null,
			source: null,
		});
	}, []);

	return {
		coords: state.coords,
		loading: state.loading,
		error: state.error,
		source: state.source,
		requestLocation,
		clearLocation,
	};
}
