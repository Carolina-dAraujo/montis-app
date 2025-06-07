interface FieldConfig {
	title: string;
	description: string;
	placeholder: string;
	keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
	secureTextEntry?: boolean;
}

export const fieldConfig: Record<string, FieldConfig> = {
	name: {
		title: 'Nome',
		description: 'Digite seu nome completo',
		placeholder: 'Seu nome',
	},
	phone: {
		title: 'Número de celular',
		description: 'Digite seu número de celular com DDD',
		placeholder: '(00) 00000-0000',
		keyboardType: 'phone-pad',
	},
	email: {
		title: 'Email',
		description: 'Digite seu endereço de email',
		placeholder: 'seu@email.com',
		keyboardType: 'email-address',
	},
	password: {
		title: 'Senha',
		description: 'Digite sua nova senha',
		placeholder: '••••••••',
		secureTextEntry: true,
	},
};
