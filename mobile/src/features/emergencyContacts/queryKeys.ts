export const emergencyContactsQueryKeys = {
	all: ['emergencyContacts'] as const,
	list: () => [...emergencyContactsQueryKeys.all, 'list'] as const,
};
