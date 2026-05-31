import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { OnboardingProvider } from '@/features/onboarding/context/OnboardingProvider';
import { queryClient } from '@/shared/api/queryClient';
import { useAuthNavigation } from '@/features/auth/hooks/useAuthNavigation';

function RootNavigator() {
	useAuthNavigation();

	return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<OnboardingProvider>
					<RootNavigator />
				</OnboardingProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}
