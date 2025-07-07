import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';

export enum SobrietyGoal {
	ABSTINENCE = 'abstinence',
	REDUCTION = 'reduction',
	MAINTENANCE = 'maintenance'
}

export enum NotificationFrequency {
	DAILY = 'daily',
	WEEKLY = 'weekly',
	MONTHLY = 'monthly',
	NEVER = 'never'
}

export interface OnboardingData {
	displayName?: string;
	phone?: string;
	birthDate?: string;
	isCurrentlySober?: boolean;
	sobrietyGoal?: 'abstinence' | 'reduction' | 'maintenance';
	sobrietyStartDate?: string;
	lastDrinkDate?: string;
	dailyReminders?: boolean;
	notificationFrequency?: 'daily' | 'weekly' | 'monthly' | 'never';
	crisisSupport?: boolean;
	shareProgress?: boolean;
	emergencyContactName?: string;
	emergencyContactPhone?: string;
	rehabilitationGoals?: string[];
}

interface OnboardingContextType {
	onboardingData: OnboardingData;
	updateOnboardingData: (data: Partial<OnboardingData>) => void;
	clearOnboardingData: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
	children: ReactNode;
}

const ONBOARDING_DATA_KEY = 'onboarding_data';

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
	const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const loadOnboardingData = async () => {
			try {
				const storedData = await SecureStore.getItemAsync(ONBOARDING_DATA_KEY);
				if (storedData) {
					const parsedData = JSON.parse(storedData);
					setOnboardingData(parsedData);
				} else {
					// Try to load from database if local storage is empty
					try {
						const token = await storageService.getAuthToken();
						if (token) {
							const dbData = await apiService.getOnboardingData(token);
							setOnboardingData(dbData);
							// Save to local storage for future use
							await SecureStore.setItemAsync(ONBOARDING_DATA_KEY, JSON.stringify(dbData));
						}
					} catch (dbError) {
						// Silently handle database loading errors
					}
				}
			} catch (error) {
				console.error('OnboardingContext - Error loading data:', error);
			} finally {
				setIsLoaded(true);
			}
		};

		loadOnboardingData();
	}, []);

	const updateOnboardingData = async (data: Partial<OnboardingData>) => {
		setOnboardingData(prev => {
			const newData = { ...prev, ...data };

			SecureStore.setItemAsync(ONBOARDING_DATA_KEY, JSON.stringify(newData))
				.catch(error => console.error('OnboardingContext - Error saving data:', error));

			return newData;
		});
	};

	const clearOnboardingData = async () => {
		setOnboardingData({});
		try {
			await SecureStore.deleteItemAsync(ONBOARDING_DATA_KEY);
		} catch (error) {
			console.error('OnboardingContext - Error clearing data:', error);
		}
	};

	const value: OnboardingContextType = {
		onboardingData,
		updateOnboardingData,
		clearOnboardingData,
	};

	if (!isLoaded) {
		return null; // or a loading spinner
	}

	return (
		<OnboardingContext.Provider value={value}>
			{children}
		</OnboardingContext.Provider>
	);
};

export const useOnboarding = (): OnboardingContextType => {
	const context = useContext(OnboardingContext);
	if (context === undefined) {
		throw new Error('useOnboarding must be used within an OnboardingProvider');
	}
	return context;
}; 