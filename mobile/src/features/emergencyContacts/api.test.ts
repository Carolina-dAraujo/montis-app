import { emergencyContactsApi } from '@/features/emergencyContacts/api';

describe('emergencyContactsApi', () => {
	it('lists contacts', async () => {
		const contacts = await emergencyContactsApi.getContacts('test-token');
		expect(contacts).toHaveLength(1);
		expect(contacts[0].name).toBe('Maria');
	});
});
