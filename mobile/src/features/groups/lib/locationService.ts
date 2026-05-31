import { Linking, Alert, Clipboard } from 'react-native';

export interface Address {
	city: string;
	state: string;
	neighborhood?: string;
	street?: string;
	number?: string | null;
	cep?: string;
	place?: string;
}

export class LocationService {
	static formatAddress(address: Address): string {
		const parts = [
			address.street,
			address.number || 'S/N',
			address.neighborhood,
			address.city,
			address.state
		].filter(Boolean);

		return parts.join(', ');
	}

	static async copyAddress(address: Address): Promise<void> {
		try {
			const formattedAddress = this.formatAddress(address);
			await Clipboard.setString(formattedAddress);
			Alert.alert('Endereço copiado!', 'O endereço foi copiado para a área de transferência.');
		} catch (error) {
			console.error('Error copying address:', error);
			Alert.alert('Erro', 'Não foi possível copiar o endereço.');
		}
	}

	static async openInMaps(address: Address): Promise<void> {
		try {
			const formattedAddress = this.formatAddress(address);
			const encodedAddress = encodeURIComponent(formattedAddress);

			const mapsUrl = `maps://?q=${encodedAddress}`;
			const googleMapsUrl = `https://maps.google.com/?q=${encodedAddress}`;

			const supported = await Linking.canOpenURL(mapsUrl);
			if (supported) {
				await Linking.openURL(mapsUrl);
			} else {
				await Linking.openURL(googleMapsUrl);
			}
		} catch (error) {
			console.error('Error opening maps:', error);
			Alert.alert('Erro', 'Não foi possível abrir o aplicativo de mapas.');
		}
	}

	static async openInGoogleMaps(address: Address): Promise<void> {
		try {
			const formattedAddress = this.formatAddress(address);
			const encodedAddress = encodeURIComponent(formattedAddress);
			await Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
		} catch (error) {
			console.error('Error opening Google Maps:', error);
			Alert.alert('Erro', 'Não foi possível abrir o Google Maps.');
		}
	}

	static async openInWaze(address: Address): Promise<void> {
		try {
			const formattedAddress = this.formatAddress(address);
			const encodedAddress = encodeURIComponent(formattedAddress);

			const wazeUrl = `waze://?q=${encodedAddress}&navigate=yes`;
			const wazeWebUrl = `https://waze.com/ul?q=${encodedAddress}&navigate=yes`;

			const supported = await Linking.canOpenURL(wazeUrl);
			if (supported) {
				await Linking.openURL(wazeUrl);
			} else {
				await Linking.openURL(wazeWebUrl);
			}
		} catch (error) {
			console.error('Error opening Waze:', error);
			Alert.alert('Erro', 'Não foi possível abrir o Waze.');
		}
	}

	static async openURL(url: string, fallbackUrl?: string): Promise<void> {
		try {
			const supported = await Linking.canOpenURL(url);
			if (supported) {
				await Linking.openURL(url);
			} else if (fallbackUrl) {
				await Linking.openURL(fallbackUrl);
			}
		} catch (error) {
			console.error('Error opening URL:', error);
			if (fallbackUrl) {
				await Linking.openURL(fallbackUrl);
			}
		}
	}

	static async getAvailableNavigationApps(): Promise<string[]> {
		const apps = [];

		try {
			if (await Linking.canOpenURL('maps://')) {
				apps.push('maps');
			}
		} catch (error) {
		}

		try {
			if (await Linking.canOpenURL('comgooglemaps://')) {
				apps.push('google-maps');
			}
		} catch (error) {
		}

		try {
			if (await Linking.canOpenURL('waze://')) {
				apps.push('waze');
			}
		} catch (error) {
		}

		return apps;
	}
}
