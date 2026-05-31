export const crisisLogQueryKeys = {
	all: ['crisisLog'] as const,
	list: () => [...crisisLogQueryKeys.all, 'list'] as const,
};
