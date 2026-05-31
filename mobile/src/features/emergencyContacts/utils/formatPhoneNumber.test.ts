import { formatPhoneNumber } from './formatPhoneNumber';

describe('formatPhoneNumber', () => {
	it('formats 11-digit mobile numbers', () => {
		expect(formatPhoneNumber('11987654321')).toBe('(11) 98765-4321');
	});

	it('returns partial input while typing', () => {
		expect(formatPhoneNumber('11')).toBe('(11');
	});
});
