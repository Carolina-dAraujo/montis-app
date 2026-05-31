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
			'no-restricted-imports': [
				'warn',
				{
					patterns: [
						{
							group: ['@/mobile/src/features/*'],
							message: 'Use @/features/* instead.',
						},
					],
				},
			],
		},
	},
]);
