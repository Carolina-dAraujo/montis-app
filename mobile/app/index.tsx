import { Redirect } from 'expo-router';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { useAppBootstrap } from '@/features/auth/hooks/useAppBootstrap';

export default function StartPage() {
	const {
		isLoading,
		isAuthenticated,
		shouldShowOnboarding,
		shouldShowHome,
	} = useAppBootstrap();

	if (isLoading) {
		return <LoadingScreen message="Verificando autenticação..." />;
	}

	if (isAuthenticated) {
		if (shouldShowOnboarding) {
			return <Redirect href="/onboarding/welcome" />;
		}
		if (shouldShowHome) {
			return <Redirect href="/(tabs)/home" />;
		}
	}

	return <Redirect href="/(auth)/login" />;
}
