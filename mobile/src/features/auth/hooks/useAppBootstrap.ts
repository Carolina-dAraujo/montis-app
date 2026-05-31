import { useAuth } from '@/features/auth/context/AuthProvider';

export function useAppBootstrap() {
	const { isAuthenticated, isLoading, isAuthReady, onboardingCompleted } = useAuth();

	return {
		isLoading: !isAuthReady || isLoading,
		isAuthenticated,
		onboardingCompleted,
		shouldShowOnboarding: isAuthenticated && onboardingCompleted === false,
		shouldShowHome: isAuthenticated && onboardingCompleted === true,
	};
}
