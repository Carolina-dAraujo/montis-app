import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { apiService } from '@/mobile/services/api';
import { storageService } from '@/mobile/services/storage';
import { NotificationFrequency } from '@/mobile/contexts/OnboardingContext';

export interface Preferences {
	dailyReminders: boolean;
	notificationFrequency: NotificationFrequency;
	crisisSupport: boolean;
	shareProgress: boolean;
	// Campos extras do onboarding
	displayName?: string;
	phone?: string;
	birthDate?: string;
	sobrietyGoal?: string;
	sobrietyStartDate?: string;
	lastDrinkDate?: string;
	emergencyContactName?: string;
	emergencyContactPhone?: string;
	address?: string;
	city?: string;
	neighborhood?: string;
	cep?: string;
}

export interface Permissions {
	notifications: boolean;
	location: boolean;
}

export const usePreferences = () => {
	const [preferences, setPreferences] = useState<Preferences>({
		dailyReminders: false,
		notificationFrequency: NotificationFrequency.DAILY,
		crisisSupport: false,
		shareProgress: false,
	});
	
	const [permissions, setPermissions] = useState<Permissions>({
		notifications: false,
		location: false,
	});
	
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		loadPreferences();
		loadPermissions();
	}, []);

	const loadPreferences = async () => {
		try {
			const token = await storageService.getAuthToken();
			if (token) {
				const data = await apiService.getPreferences(token);
				setPreferences({
					...preferences,
					...data,
					notificationFrequency: data.notificationFrequency as NotificationFrequency,
				});
			}
		} catch (error) {
			console.error('Error loading preferences:', error);
		}
	};

	const loadPermissions = async () => {
		try {
			const token = await storageService.getAuthToken();
			if (token) {
				const data = await apiService.getPermissions(token);
				setPermissions({
					notifications: data.notifications.granted,
					location: data.location.granted,
				});
			}
		} catch (error) {
			console.error('Error loading permissions:', error);
		}
	};

	const updatePreferences = async (newPreferences: Partial<Preferences>) => {
		try {
			setIsLoading(true);
			const updatedPreferences = { ...preferences, ...newPreferences };
			const token = await storageService.getAuthToken();
			
			if (token) {
				// Enviar todos os campos para o backend
				await apiService.updatePreferences(token, updatedPreferences);
				setPreferences(updatedPreferences);
			}
		} catch (error) {
			console.error('Error updating preferences:', error);
			Alert.alert('Erro', 'Não foi possível salvar as preferências. Tente novamente.');
		} finally {
			setIsLoading(false);
		}
	};

	const updatePermissions = async (newPermissions: Partial<Permissions>) => {
		try {
			setIsLoading(true);
			const updatedPermissions = { ...permissions, ...newPermissions };
			const token = await storageService.getAuthToken();
			
			if (token) {
				await apiService.updatePermissions(token, {
					notifications: updatedPermissions.notifications,
					location: updatedPermissions.location,
				});
				
				setPermissions(updatedPermissions);
			}
		} catch (error) {
			console.error('Error updating permissions:', error);
			Alert.alert('Erro', 'Não foi possível salvar as permissões. Tente novamente.');
		} finally {
			setIsLoading(false);
		}
	};

	return {
		preferences,
		permissions,
		isLoading,
		updatePreferences,
		updatePermissions,
		loadPreferences,
		loadPermissions,
	};
}; 