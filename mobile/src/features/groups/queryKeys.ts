export const groupsQueryKeys = {
	all: ['groups'] as const,
	userGroups: () => [...groupsQueryKeys.all, 'user'] as const,
};
