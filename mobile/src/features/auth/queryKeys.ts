export const authQueryKeys = {
	all: ['auth'] as const,
	profile: (token: string) => [...authQueryKeys.all, 'profile', token] as const,
	onboardingStatus: (token: string) => [...authQueryKeys.all, 'onboardingStatus', token] as const,
};
