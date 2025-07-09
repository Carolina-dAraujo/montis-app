import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';
import { storageService, StoredUserData } from '../services/storage';
import { router } from 'expo-router';
import { getAuth, signInWithCustomToken } from 'firebase/auth';

interface AuthContextType {
    user: StoredUserData | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuthStatus: () => Promise<void>;
    updateUser: (userData: Partial<StoredUserData>) => Promise<void>;
    updateUserFromOnboarding: (onboardingData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<StoredUserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

    const checkAuthStatus = async () => {
        try {
            // Get stored token
            const token = await storageService.getAuthToken();

            if (!token) {
                setUser(null);
                setIsAuthenticated(false);
                return;
            }

            // Always verify with database/server
            try {
                const profile = await apiService.getProfile(token);

                // Token is valid, authenticate with Firebase Auth
                const auth = getAuth();
                console.log('Attempting Firebase Auth with stored token...');
                await signInWithCustomToken(auth, token);
                console.log('Firebase Auth successful with stored token!');

                // Token is valid, user is authenticated
                setUser(profile);
                setIsAuthenticated(true);

                // Update local storage with fresh data
                await storageService.setUserData(profile);
                await storageService.setAuthToken(token);

                // Check onboarding status and redirect if needed
                try {
                    const onboardingStatus = await apiService.checkOnboardingStatus(token);
                    
                    if (!onboardingStatus.onboardingCompleted) {
                        // User hasn't completed onboarding, redirect to onboarding
                        router.replace('/onboarding/welcome' as any);
                        return;
                    }
                } catch (error) {
                    // If onboarding status check fails, assume onboarding is needed
                    router.replace('/onboarding/welcome' as any);
                    return;
                }

            } catch (error) {
                // Token is invalid, clear everything
                await logout();
            }

        } catch (error) {
            console.error('Error checking auth status:', error);
            await logout();
        } finally {
            setIsLoading(false);
            setHasCheckedAuth(true);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);

            const response = await apiService.login({ email, password });

            // Authenticate with Firebase using the custom token
            const auth = getAuth();
            console.log('Attempting Firebase Auth with custom token...');
            await signInWithCustomToken(auth, response.token);
            console.log('Firebase Auth successful!');

            // Store auth data
            await storageService.setAuthToken(response.token);
            await storageService.setUserData(response.user);

            // Update state
            setUser(response.user);
            setIsAuthenticated(true);

            // Check onboarding status
            try {
                const onboardingStatus = await apiService.checkOnboardingStatus(response.token);
                
                if (onboardingStatus.onboardingCompleted) {
                    // User has completed onboarding, go to home
                    router.replace('/(tabs)/home' as any);
                } else {
                    // User hasn't completed onboarding, go to onboarding
                    router.replace('/onboarding/welcome' as any);
                }
            } catch (error) {
                // If onboarding status check fails, assume onboarding is needed
                router.replace('/onboarding/welcome' as any);
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string) => {
        try {
            setIsLoading(true);

            const response = await apiService.register({ email, password });

            // Authenticate with Firebase using the custom token
            const auth = getAuth();
            console.log('Attempting Firebase Auth with custom token (register)...');
            await signInWithCustomToken(auth, response.token);
            console.log('Firebase Auth successful (register)!');

            await storageService.setAuthToken(response.token);
            await storageService.setUserData(response.user);

            setUser(response.user);
            setIsAuthenticated(true);

            // New users should always go to onboarding
            router.replace('/onboarding/welcome' as any);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            // Sign out from Firebase Auth
            const auth = getAuth();
            await auth.signOut();

            await storageService.clearAuthData();

            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateUser = async (userData: Partial<StoredUserData>) => {
        try {
            if (user) {
                const updatedUser = { ...user, ...userData };
                await storageService.updateUserData(userData);
                setUser(updatedUser);
            }
        } catch (error) {
            console.error('Update user error:', error);
            throw error;
        }
    };

    const updateUserFromOnboarding = async (onboardingData: any) => {
        try {
            if (user && onboardingData.displayName) {
                const updatedUser = { ...user, displayName: onboardingData.displayName };
                await storageService.updateUserData({ displayName: onboardingData.displayName });
                setUser(updatedUser);
            }
        } catch (error) {
            console.error('Update user from onboarding error:', error);
            throw error;
        }
    };

    useEffect(() => {
        if (!hasCheckedAuth) {
            checkAuthStatus();
        }
    }, [hasCheckedAuth]);

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuthStatus,
        updateUser,
        updateUserFromOnboarding,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        return {
            user: null,
            isLoading: true,
            isAuthenticated: false,
            login: async () => { throw new Error('Auth not initialized'); },
            register: async () => { throw new Error('Auth not initialized'); },
            logout: async () => { throw new Error('Auth not initialized'); },
            checkAuthStatus: async () => { throw new Error('Auth not initialized'); },
            updateUser: async () => { throw new Error('Auth not initialized'); },
            updateUserFromOnboarding: async () => { throw new Error('Auth not initialized'); },
        };
    }
    return context;
};
