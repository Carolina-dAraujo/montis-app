const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
	{
		...expoConfig,
		settings: {
			'import/resolver': {
				typescript: {
					project: './tsconfig.json',
				},
			},
		},
	},
	{
		ignores: ['dist/*'],
	},
	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'warn',
			'no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: '@/services/api',
							message: 'Use @/features/<domain>/api instead.',
						},
						{
							name: '@/contexts/AuthContext',
							message: 'Use @/features/auth/context/AuthProvider.',
						},
						{
							name: '@/contexts/OnboardingContext',
							message: 'Use @/features/onboarding/context/OnboardingProvider.',
						},
					],
					patterns: [
						{
							group: ['@/mobile/src/features/*'],
							message: 'Use @/features/* instead.',
						},
						{
							group: ['components/*', '@/components/*'],
							message: 'Use @/shared/components/* instead.',
						},
						{
							group: ['contexts/*', '@/contexts/*'],
							message: 'Use @/features/*/context instead.',
						},
						{
							group: ['services/*', '@/services/*'],
							message: 'Use @/features/*/api or @/shared/lib/* instead.',
						},
					],
				},
			],
		},
	},
]);
