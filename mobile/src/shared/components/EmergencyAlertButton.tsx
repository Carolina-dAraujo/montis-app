import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/shared/theme/colors';
import { useEmergencyAlerts } from '@/features/emergencyContacts/hooks/useEmergencyAlerts';
import type { SendEmergencyAlertDto } from '@/features/emergencyContacts/alertsApi';
import * as Location from 'expo-location';

interface EmergencyAlertButtonProps {
	style?: StyleProp<ViewStyle>;
}

const EmergencyAlertButton: React.FC<EmergencyAlertButtonProps> = ({ style }) => {
	const { sendEmergencyAlert, loading } = useEmergencyAlerts();
	const [isPressed, setIsPressed] = useState(false);

	const handleEmergencyAlert = async () => {
		Alert.alert(
			'🚨 Alerta de Emergência',
			'Tem certeza que deseja enviar um alerta de emergência para seus contatos?',
			[
				{ text: 'Cancelar', style: 'cancel' },
				{
					text: 'Enviar Alerta',
					style: 'destructive',
					onPress: async () => {
						try {
							// Get current location
							let locationData: SendEmergencyAlertDto['location'];
							
							try {
								const { status } = await Location.requestForegroundPermissionsAsync();
								if (status === 'granted') {
									const location = await Location.getCurrentPositionAsync({
										accuracy: Location.Accuracy.High,
									});
									
									locationData = {
										latitude: location.coords.latitude,
										longitude: location.coords.longitude,
									};

									// Try to get address
									try {
										const reverseGeocode = await Location.reverseGeocodeAsync({
											latitude: location.coords.latitude,
											longitude: location.coords.longitude,
										});
										
										if (reverseGeocode.length > 0) {
											const address = reverseGeocode[0];
											locationData.address = [
												address.street,
												address.city,
												address.region,
												address.country
											].filter(Boolean).join(', ');
										}
									} catch (geocodeError) {
										console.warn('Could not get address:', geocodeError);
									}
								}
							} catch (locationError) {
								console.warn('Could not get location:', locationError);
							}

							await sendEmergencyAlert({
								message: 'Preciso de ajuda urgente!',
								location: locationData,
							});
						} catch (error) {
							Alert.alert('Erro', 'Não foi possível enviar o alerta. Tente novamente.');
						}
					}
				}
			]
		);
	};

	const handlePressIn = () => {
		setIsPressed(true);
	};

	const handlePressOut = () => {
		setIsPressed(false);
	};

	return (
		<TouchableOpacity
			style={[
				styles.emergencyButton,
				isPressed && styles.emergencyButtonPressed,
				style
			]}
			onPress={handleEmergencyAlert}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			disabled={loading}
		>
			{loading ? (
				<ActivityIndicator color="white" size="small" />
			) : (
				<>
					<Ionicons name="warning" size={24} color="white" />
					<Text style={styles.emergencyButtonText}>ALERTA DE EMERGÊNCIA</Text>
				</>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	emergencyButton: {
		backgroundColor: '#FF3B30',
		paddingVertical: 16,
		paddingHorizontal: 24,
		borderRadius: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#FF3B30',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
		gap: 8,
	},
	emergencyButtonPressed: {
		backgroundColor: '#D70015',
		shadowOpacity: 0.5,
		transform: [{ scale: 0.95 }],
	},
	emergencyButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});

export default EmergencyAlertButton; 