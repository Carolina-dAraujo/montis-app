export interface PasswordValidationResult {
    isValid: boolean;
    error?: string;
}

export const validatePassword = (password: string): PasswordValidationResult => {
    if (!password.trim()) {
        return { isValid: false, error: 'Senha não pode estar vazia' };
    }

    if (password.length < 8) {
        return { isValid: false, error: 'Senha deve ter pelo menos 8 caracteres' };
    }

    if (!/[A-Z]/.test(password)) {
        return { isValid: false, error: 'Senha deve conter pelo menos uma letra maiúscula' };
    }

    if (!/[a-z]/.test(password)) {
        return { isValid: false, error: 'Senha deve conter pelo menos uma letra minúscula' };
    }

    if (!/[0-9]/.test(password)) {
        return { isValid: false, error: 'Senha deve conter pelo menos um número' };
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { isValid: false, error: 'Senha deve conter pelo menos um caractere especial' };
    }

    return { isValid: true };
};

export const getPasswordRules = () => [
    'Mínimo de 8 caracteres',
    'Pelo menos uma letra maiúscula',
    'Pelo menos uma letra minúscula',
    'Pelo menos um número',
    'Pelo menos um caractere especial'
];
