export function formatPhoneNumber(text: string): string {
	const cleaned = text.replace(/\D/g, '');

	if (cleaned.length === 0) {
		return '';
	}
	if (cleaned.length <= 2) {
		return `(${cleaned}`;
	}
	if (cleaned.length <= 6) {
		return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
	}
	if (cleaned.length <= 10) {
		return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
	}
	return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
}
