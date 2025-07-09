import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { LoadingScreen } from "../components/LoadingScreen";
import { useEffect, useState } from "react";
import { apiService } from "../services/api";
import { storageService } from "../services/storage";

const StartPage = () => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const [onboardingStatus, setOnboardingStatus] = useState<boolean | null>(null);
    const [checkingOnboarding, setCheckingOnboarding] = useState(false);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            if (isAuthenticated && user && !checkingOnboarding) {
                setCheckingOnboarding(true);
                try {
                    const token = await storageService.getAuthToken();
                    if (token) {
                        const { onboardingCompleted } = await apiService.checkOnboardingStatus(token);
                        setOnboardingStatus(onboardingCompleted);
                    }
                } catch (error) {
                    console.error('Error checking onboarding status:', error);
                    setOnboardingStatus(false);
                } finally {
                    setCheckingOnboarding(false);
                }
            }
        };

        checkOnboardingStatus();
    }, [isAuthenticated, user, checkingOnboarding]);

    if (isLoading || (isAuthenticated && onboardingStatus === null)) {
        return <LoadingScreen message="Verificando autenticação..." />;
    }

    if (isAuthenticated) {
        if (onboardingStatus === false) {
            return <Redirect href="/onboarding/welcome" />;
        } else {
            return <Redirect href="/(tabs)/home" />;
        }
    } else {
        return <Redirect href="/(auth)/login" />;
    }
};

export default StartPage;