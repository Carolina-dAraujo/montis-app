import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';
import { storageService, StoredUserData } from '../services/storage';
import { router } from 'expo-router';

interface AuthContextType {
    user: StoredUserData | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuthStatus: () => Promise<void>;
    updateUser: (userData: Partial<StoredUserData>) => Promise<void>;
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
            // Avoid checking if already loading or authenticated
            if (isLoading || isAuthenticated) {
                console.log('AuthContext - Skipping checkAuthStatus, already loading or authenticated');
                return;
            }
            
            setIsLoading(true);
            console.log('AuthContext - Starting auth status check');
            
            // Check if user is logged in
            const isLoggedIn = await storageService.isLoggedIn();
            
            if (isLoggedIn) {
                // Get stored user data
                const userData = await storageService.getUserData();
                const token = await storageService.getAuthToken();
                
                if (userData && token) {
                    // Verify token with server
                    try {
                        const profile = await apiService.getProfile(token);
                        setUser(userData);
                        setIsAuthenticated(true);
                        console.log('AuthContext - User authenticated from storage');
                    } catch (error) {
                        console.log('Token invalid, clearing auth data');
                        await logout();
                    }
                } else {
                    await logout();
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
                console.log('AuthContext - No stored auth data found');
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            await logout();
        } finally {
            setIsLoading(false);
            setHasCheckedAuth(true);
            console.log('AuthContext - Auth status check completed');
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            console.log('AuthContext - Starting login process');
            
            const response = await apiService.login({ email, password });
            console.log('AuthContext - Login API response received:', response.user.email);
            
            // Store auth data
            await storageService.setAuthToken(response.token);
            await storageService.setUserData(response.user);
            console.log('AuthContext - Auth data stored');
            
            // Update state directly without calling checkAuthStatus
            setUser(response.user);
            setIsAuthenticated(true);

            // Navigate to home screen
            router.replace('/(tabs)/home' as any);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
            console.log('AuthContext - Login process completed');
        }
    };

    const register = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            console.log('AuthContext - Starting registration process');
            
            const response = await apiService.register({ email, password });
            console.log('AuthContext - Registration API response received:', response.user.email);
            
            // Store auth data
            await storageService.setAuthToken(response.token);
            await storageService.setUserData(response.user);
            console.log('AuthContext - Auth data stored');
            
            // Update state directly without calling checkAuthStatus
            setUser(response.user);
            setIsAuthenticated(true);

            // Navigate to home screen
            router.replace('/(tabs)/home' as any);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally {
            setIsLoading(false);
            console.log('AuthContext - Registration process completed');
        }
    };

    const logout = async () => {
        try {
            // Clear stored data
            await storageService.clearAuthData();
            
            // Update state
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

    // Check auth status on app start
    useEffect(() => {
        if (!hasCheckedAuth) {
            console.log('AuthContext - useEffect triggered, checking auth status');
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
    };

    console.log('AuthContext - Current state:', { 
        isAuthenticated, 
        isLoading, 
        userEmail: user?.email,
        hasUser: !!user 
    });

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 