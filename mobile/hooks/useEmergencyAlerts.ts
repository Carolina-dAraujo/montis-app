import { useState, useCallback } from 'react';
import { emergencyAlertService, EmergencyAlert, SendEmergencyAlertDto } from '../services/EmergencyAlertService';
import { storageService } from '../services/storage';
import { Alert } from 'react-native';

export const useEmergencyAlerts = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const sendEmergencyAlert = useCallback(async (alertData: SendEmergencyAlertDto): Promise<EmergencyAlert> => {
		try {
			const token = await storageService.getAuthToken();
			if (!token) throw new Error('Token não disponível');

			setLoading(true);
			setError(null);
			
			const alert = await emergencyAlertService.sendEmergencyAlert(token, alertData);
			
			Alert.alert(
				'Alerta enviado',
				'Seu alerta de emergência foi enviado para seus contatos ativos.',
				[{ text: 'OK' }]
			);
			
			return alert;
		} catch (err) {
			console.error('Error sending emergency alert:', err);
			const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar alerta';
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	}, []);

	const getAlertHistory = useCallback(async (): Promise<EmergencyAlert[]> => {
		try {
			const token = await storageService.getAuthToken();
			if (!token) throw new Error('Token não disponível');

			setError(null);
			return await emergencyAlertService.getAlertHistory(token);
		} catch (err) {
			console.error('Error fetching alert history:', err);
			const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar histórico';
			setError(errorMessage);
			throw new Error(errorMessage);
		}
	}, []);

	return {
		loading,
		error,
		sendEmergencyAlert,
		getAlertHistory,
	};
}; 