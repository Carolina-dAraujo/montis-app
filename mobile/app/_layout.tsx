import { Stack } from "expo-router"
import { AuthProvider } from "../contexts/AuthContext"
import { OnboardingProvider } from "../contexts/OnboardingContext"

const StackLayout = () => {
    return (
        <AuthProvider>
            <OnboardingProvider>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(auth)/cadastro" />
                                        <Stack.Screen name="(auth)/login" />
                    <Stack.Screen name="onboarding/welcome" />
                    <Stack.Screen name="onboarding/personalInfo" />
                    <Stack.Screen name="onboarding/sobrietyStatus" />
                    <Stack.Screen name="onboarding/sobrietyTimeline" />
                    <Stack.Screen name="onboarding/sobrietyGoals" />
                    <Stack.Screen name="onboarding/rehabilitationGoals" />
                    <Stack.Screen name="onboarding/preferences" />
                    <Stack.Screen name="onboarding/completion" />
                    <Stack.Screen name="services/aa" />
                    <Stack.Screen name="services/caps" />
                    <Stack.Screen name="(config)/add-emergency-contact" />
                </Stack>
            </OnboardingProvider>
        </AuthProvider>
    )
}

export default StackLayout
