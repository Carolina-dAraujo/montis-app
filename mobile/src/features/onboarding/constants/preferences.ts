import { NotificationFrequency } from '@/features/onboarding/context/OnboardingProvider';

export const notificationOptions = [
	{
		id: NotificationFrequency.DAILY,
		title: 'Diariamente',
		description: 'Receber lembretes todos os dias',
	},
	{
		id: NotificationFrequency.WEEKLY,
		title: 'Semanalmente',
		description: 'Receber lembretes uma vez por semana',
	},
	{
		id: NotificationFrequency.MONTHLY,
		title: 'Mensalmente',
		description: 'Receber lembretes uma vez por mês',
	},
	{
		id: NotificationFrequency.NEVER,
		title: 'Nunca',
		description: 'Não receber lembretes',
	},
];
