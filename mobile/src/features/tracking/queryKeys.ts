export const trackingQueryKeys = {
	all: ['tracking'] as const,
	daily: (date: string) => [...trackingQueryKeys.all, 'daily', date] as const,
	month: (year: number, month: number) =>
		[...trackingQueryKeys.all, 'month', year, month] as const,
};
