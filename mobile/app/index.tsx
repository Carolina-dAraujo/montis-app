import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { LoadingScreen } from "../components/LoadingScreen";

const StartPage = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // Show loading while checking auth status
    if (isLoading) {
        return <LoadingScreen message="Verificando autenticação..." />;
    }

    // Redirect based on authentication status
    if (isAuthenticated) {
        return <Redirect href="/(tabs)/home" />;
    } else {
        return <Redirect href="/(auth)/login" />;
    }
};

export default StartPage;