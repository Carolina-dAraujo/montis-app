import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api';
import { authQueryKeys } from '@/features/auth/queryKeys';
import { storageService, StoredUserData } from '@/shared/lib/storage';
import type { OnboardingData } from '@/features/onboarding/types';

interface AuthContextType {
	user: StoredUserData | null;
	isLoading: boolean;
	isAuthReady: boolean;
	isAuthenticated: boolean;
	onboardingCompleted: boolean | null;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	checkAuthStatus: () => Promise<void>;
	updateUser: (userData: Partial<StoredUserData>) => Promise<void>;
	updateUserFromOnboarding: (onboardingData: Pick<OnboardingData, 'displayName'>) => Promise<void>;
	markOnboardingComplete: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const queryClient = useQueryClient();
	const [token, setToken] = useState<string | null | undefined>(undefined);
	const [user, setUser] = useState<StoredUserData | null>(null);
	const [onboardingCompletedOverride, setOnboardingCompletedOverride] = useState<boolean | null>(null);

	useEffect(() => {
		storageService.getAuthToken().then((stored) => setToken(stored));
	}, []);

	const profileQuery = useQuery({
		queryKey: token ? authQueryKeys.profile(token) : ['auth', 'profile', 'none'],
		queryFn: async () => {
			if (!token) throw new Error('No token');
			const profile = await authApi.getProfile(token);
			await storageService.setUserData(profile);
			return profile;
		},
		enabled: !!token,
		retry: false,
	});

	const onboardingQuery = useQuery({
		queryKey: token ? authQueryKeys.onboardingStatus(token) : ['auth', 'onboarding', 'none'],
		queryFn: async () => {
			if (!token) throw new Error('No token');
			const status = await authApi.checkOnboardingStatus(token);
			return status.onboardingCompleted;
		},
		enabled: !!token && profileQuery.isSuccess,
		retry: false,
	});

	useEffect(() => {
		if (profileQuery.data) {
			setUser(profileQuery.data);
		}
	}, [profileQuery.data]);

	useEffect(() => {
		if (profileQuery.isError && token) {
			void (async () => {
				await storageService.clearAuthData();
				setToken(null);
				setUser(null);
				setOnboardingCompletedOverride(null);
				queryClient.clear();
			})();
		}
	}, [profileQuery.isError, token, queryClient]);

	const isAuthReady = token !== undefined;
	const isAuthenticated = !!token && profileQuery.isSuccess;
	const onboardingCompleted =
		onboardingCompletedOverride ?? (onboardingQuery.data ?? (token ? null : null));

	const isLoading =
		!isAuthReady
		|| (!!token && (profileQuery.isPending || (profileQuery.isSuccess && onboardingQuery.isPending)));

	const login = async (email: string, password: string) => {
		const response = await authApi.login({ email, password });
		await storageService.setAuthToken(response.token);
		await storageService.setUserData(response.user);
		setToken(response.token);
		setUser(response.user);
		setOnboardingCompletedOverride(null);
		await queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
	};

	const register = async (email: string, password: string) => {
		const response = await authApi.register({ email, password });
		await storageService.setAuthToken(response.token);
		await storageService.setUserData(response.user);
		setToken(response.token);
		setUser(response.user);
		setOnboardingCompletedOverride(false);
		await queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
	};

	const logout = useCallback(async () => {
		await storageService.clearAuthData();
		setToken(null);
		setUser(null);
		setOnboardingCompletedOverride(null);
		queryClient.clear();
	}, [queryClient]);

	const checkAuthStatus = async () => {
		const stored = await storageService.getAuthToken();
		setToken(stored);
		setOnboardingCompletedOverride(null);
		await queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
	};

	const updateUser = async (userData: Partial<StoredUserData>) => {
		if (user) {
			const updatedUser = { ...user, ...userData };
			await storageService.updateUserData(userData);
			setUser(updatedUser);
			if (token) {
				queryClient.setQueryData(authQueryKeys.profile(token), updatedUser);
			}
		}
	};

	const markOnboardingComplete = () => {
		setOnboardingCompletedOverride(true);
		if (token) {
			queryClient.setQueryData(authQueryKeys.onboardingStatus(token), true);
		}
	};

	const updateUserFromOnboarding = async (onboardingData: Pick<OnboardingData, 'displayName'>) => {
		if (user && onboardingData.displayName) {
			const updatedUser = { ...user, displayName: onboardingData.displayName };
			await storageService.updateUserData({ displayName: onboardingData.displayName });
			setUser(updatedUser);
		}
	};

	const value: AuthContextType = {
		user,
		isLoading,
		isAuthReady,
		isAuthenticated,
		onboardingCompleted,
		login,
		register,
		logout,
		checkAuthStatus,
		updateUser,
		updateUserFromOnboarding,
		markOnboardingComplete,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		return {
			user: null,
			isLoading: true,
			isAuthReady: false,
			isAuthenticated: false,
			onboardingCompleted: null,
			login: async () => { throw new Error('Auth not initialized'); },
			register: async () => { throw new Error('Auth not initialized'); },
			logout: async () => { throw new Error('Auth not initialized'); },
			checkAuthStatus: async () => { throw new Error('Auth not initialized'); },
			updateUser: async () => { throw new Error('Auth not initialized'); },
			updateUserFromOnboarding: async () => { throw new Error('Auth not initialized'); },
			markOnboardingComplete: () => { throw new Error('Auth not initialized'); },
		};
	}
	return context;
};
