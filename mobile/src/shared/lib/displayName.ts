/** True when displayName is the default email local-part placeholder from registration. */
export function isEmailPlaceholderName(
	displayName: string | undefined,
	email: string | undefined,
): boolean {
	if (!displayName || !email) return false;
	const localPart = email.split('@')[0]?.toLowerCase();
	return displayName.trim().toLowerCase() === localPart;
}

export function resolveUserDisplayName(options: {
	displayName?: string;
	email?: string;
	onboardingDisplayName?: string;
	fallback?: string;
}): string {
	const { displayName, email, onboardingDisplayName, fallback = 'Usuário' } = options;

	if (onboardingDisplayName?.trim()) {
		return onboardingDisplayName.trim();
	}

	if (displayName?.trim() && !isEmailPlaceholderName(displayName, email)) {
		return displayName.trim();
	}

	return fallback;
}
