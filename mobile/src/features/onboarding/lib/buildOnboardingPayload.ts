import type { OnboardingRequest } from '@/features/onboarding/api';
import type { OnboardingData } from '@/features/onboarding/types';

const SOBRIETY_GOALS = new Set(['abstinence', 'reduction', 'maintenance']);
const NOTIFICATION_FREQUENCIES = new Set(['daily', 'weekly', 'monthly', 'never']);

function toBoolean(value: unknown, fallback: boolean): boolean {
	if (typeof value === 'boolean') {
		return value;
	}

	if (value === 'true') {
		return true;
	}

	if (value === 'false') {
		return false;
	}

	return fallback;
}

function toApiDateString(value?: string): string | undefined {
	if (!value) {
		return undefined;
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return undefined;
	}

	return date.toISOString();
}

function assignOptionalString(
	payload: OnboardingRequest,
	key: 'phone' | 'address' | 'city' | 'neighborhood' | 'cep',
	value?: string,
) {
	const trimmed = value?.trim();
	if (trimmed) {
		payload[key] = trimmed;
	}
}

export function buildOnboardingPayload(data: OnboardingData): OnboardingRequest {
	const displayName = data.displayName?.trim();
	if (!displayName) {
		throw new Error('Nome é obrigatório. Volte e preencha suas informações pessoais.');
	}

	const birthDate = toApiDateString(data.birthDate);
	if (!birthDate) {
		throw new Error('Data de nascimento é obrigatória. Volte e preencha suas informações pessoais.');
	}

	const isCurrentlySober = data.isCurrentlySober ?? true;
	const sobrietyStartDate = isCurrentlySober
		? toApiDateString(data.sobrietyStartDate)
		: undefined;
	const lastDrinkDate = !isCurrentlySober
		? toApiDateString(data.lastDrinkDate)
		: undefined;

	if (isCurrentlySober && !sobrietyStartDate) {
		throw new Error('Data de início da sobriedade é obrigatória.');
	}

	if (!isCurrentlySober && !lastDrinkDate) {
		throw new Error('Data da última bebida é obrigatória.');
	}

	const sobrietyGoal = SOBRIETY_GOALS.has(data.sobrietyGoal ?? '')
		? (data.sobrietyGoal as OnboardingRequest['sobrietyGoal'])
		: 'abstinence';
	const notificationFrequency = NOTIFICATION_FREQUENCIES.has(data.notificationFrequency ?? '')
		? (data.notificationFrequency as OnboardingRequest['notificationFrequency'])
		: 'daily';

	const payload: OnboardingRequest = {
		displayName,
		birthDate,
		sobrietyGoal,
		dailyReminders: toBoolean(data.dailyReminders, false),
		notificationFrequency,
		crisisSupport: toBoolean(data.crisisSupport, false),
		shareProgress: toBoolean(data.shareProgress, false),
	};

	assignOptionalString(payload, 'phone', data.phone);
	assignOptionalString(payload, 'address', data.address);
	assignOptionalString(payload, 'city', data.city);
	assignOptionalString(payload, 'neighborhood', data.neighborhood);
	assignOptionalString(payload, 'cep', data.cep);

	if (sobrietyStartDate) {
		payload.sobrietyStartDate = sobrietyStartDate;
	}

	if (lastDrinkDate) {
		payload.lastDrinkDate = lastDrinkDate;
	}

	return payload;
}
