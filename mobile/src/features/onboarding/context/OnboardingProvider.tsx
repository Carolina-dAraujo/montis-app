import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import {
	NotificationFrequency,
	OnboardingData,
	SobrietyGoal,
} from '@/features/onboarding/types';

export { NotificationFrequency, OnboardingData, SobrietyGoal };

interface OnboardingContextType {
	onboardingData: OnboardingData;
	updateOnboardingData: (data: Partial<OnboardingData>) => void;
	clearOnboardingData: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_DATA_KEY = 'onboarding_data';

export function OnboardingProvider({ children }: { children: ReactNode }) {
	const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const loadOnboardingData = async () => {
			try {
				const storedData = await SecureStore.getItemAsync(ONBOARDING_DATA_KEY);
				if (storedData) {
					setOnboardingData(JSON.parse(storedData));
				} else {
					setOnboardingData({});
				}
			} catch (error) {
				console.error('OnboardingContext - Error loading data:', error);
				setOnboardingData({});
			} finally {
				setIsLoaded(true);
			}
		};

		loadOnboardingData();
	}, []);

	const updateOnboardingData = (data: Partial<OnboardingData>) => {
		setOnboardingData((prev) => {
			const newData = { ...prev, ...data };
			SecureStore.setItemAsync(ONBOARDING_DATA_KEY, JSON.stringify(newData)).catch((error) =>
				console.error('OnboardingContext - Error saving data:', error)
			);
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

	if (!isLoaded) {
		return null;
	}

	return (
		<OnboardingContext.Provider value={{ onboardingData, updateOnboardingData, clearOnboardingData }}>
			{children}
		</OnboardingContext.Provider>
	);
}

export const useOnboarding = (): OnboardingContextType => {
	const context = useContext(OnboardingContext);
	if (context === undefined) {
		throw new Error('useOnboarding must be used within an OnboardingProvider');
	}
	return context;
};
