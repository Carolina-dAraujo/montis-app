export const settingsQueryKeys = {
	all: ['settings'] as const,
	preferences: () => [...settingsQueryKeys.all, 'preferences'] as const,
	permissions: () => [...settingsQueryKeys.all, 'permissions'] as const,
};
