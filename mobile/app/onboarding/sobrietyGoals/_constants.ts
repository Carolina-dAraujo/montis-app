import { SobrietyGoal } from '@/mobile/contexts/OnboardingContext';

export const goalOptions = [
	{
		id: SobrietyGoal.ABSTINENCE,
		title: 'Abstinência total',
		description: 'Parar completamente de consumir álcool',
		icon: 'stop-circle' as const,
	},
	{
		id: SobrietyGoal.REDUCTION,
		title: 'Redução gradual',
		description: 'Diminuir o consumo de álcool gradualmente',
		icon: 'trending-down' as const,
	},
	{
		id: SobrietyGoal.MAINTENANCE,
		title: 'Manutenção',
		description: 'Manter o controle sobre o consumo atual',
		icon: 'shield-check' as const,
	},
];
