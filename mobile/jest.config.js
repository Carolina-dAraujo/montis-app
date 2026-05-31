module.exports = {
	preset: 'jest-expo',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	testMatch: ['**/*.test.ts', '**/*.test.tsx'],
	moduleNameMapper: {
		'^@/features/(.*)$': '<rootDir>/src/features/$1',
		'^@/shared/(.*)$': '<rootDir>/src/shared/$1',
		'^@/(.*)$': '<rootDir>/$1',
	},
};
