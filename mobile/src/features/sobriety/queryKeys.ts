export const sobrietyQueryKeys = {
	all: ['sobriety'] as const,
	data: () => [...sobrietyQueryKeys.all, 'data'] as const,
};
