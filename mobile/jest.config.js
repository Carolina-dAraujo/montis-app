module.exports = {
	preset: 'jest-expo',
	testMatch: ['**/*.test.ts', '**/*.test.tsx'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
		'^@/features/(.*)$': '<rootDir>/src/features/$1',
		'^@/shared/(.*)$': '<rootDir>/src/shared/$1',
	},
};
