export function removeUndefinedValues<T extends Record<string, unknown>>(
	obj: T,
): Partial<T> {
	const cleaned: Partial<T> = {};
	for (const [key, value] of Object.entries(obj)) {
		if (value !== undefined && value !== null) {
			cleaned[key as keyof T] = value as T[keyof T];
		}
	}
	return cleaned;
}
