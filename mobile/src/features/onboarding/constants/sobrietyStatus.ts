type SobrietyStatus = 'sober' | 'not_sober' | null;

export const statusOptions = [
	{
		id: 'sober' as SobrietyStatus,
		title: 'Sim, estou sóbrio',
		description: 'Já parei de consumir álcool e quero manter minha sobriedade',
		icon: 'check-circle' as const,
	},
	{
		id: 'not_sober' as SobrietyStatus,
		title: 'Não, ainda consumo',
		description: 'Ainda consumo álcool e quero começar minha jornada de sobriedade',
		icon: 'refresh' as const,
	},
];

export type { SobrietyStatus };
