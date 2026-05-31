import { useEffect } from 'react';
import { router, useSegments } from 'expo-router';
import { useAuth } from '@/features/auth/context/AuthProvider';

/** Navigates away from auth screens after login/register when onboarding status is known. */
export function useAuthNavigation() {
	const { isAuthenticated, onboardingCompleted, isLoading } = useAuth();
	const segments = useSegments();

	useEffect(() => {
		if (isLoading || !isAuthenticated || onboardingCompleted === null) {
			return;
		}

		const inAuthGroup = segments[0] === '(auth)';
		if (!inAuthGroup) {
			return;
		}

		if (onboardingCompleted) {
			router.replace('/(tabs)/home');
		} else {
			router.replace('/onboarding/welcome');
		}
	}, [isAuthenticated, onboardingCompleted, isLoading, segments]);
}
