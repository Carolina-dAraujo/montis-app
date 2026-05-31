import { installMockApi } from './src/test/mockApi';

(global as unknown as { __DEV__: boolean }).__DEV__ = true;

jest.mock('expo-constants', () => ({
	__esModule: true,
	default: {
		expoConfig: { extra: { apiUrl: 'http://localhost:3000' } },
	},
}));

let restoreFetch: () => void;

beforeAll(() => {
	restoreFetch = installMockApi();
});

afterAll(() => {
	restoreFetch?.();
});
