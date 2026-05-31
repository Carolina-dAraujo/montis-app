import { useAuth } from '@/features/auth/context/AuthProvider';
import { useOnboarding } from '@/features/onboarding/context/OnboardingProvider';
import { resolveUserDisplayName } from '@/shared/lib/displayName';

export function useResolvedDisplayName(fallback = 'Usuário'): string {
	const { user } = useAuth();
	const { onboardingData } = useOnboarding();

	return resolveUserDisplayName({
		displayName: user?.displayName,
		email: user?.email,
		onboardingDisplayName: onboardingData.displayName,
		fallback,
	});
}
