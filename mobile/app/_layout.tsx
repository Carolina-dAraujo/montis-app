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
                    <Stack.Screen name="tracking/[date]" />
                    <Stack.Screen name="onboarding/welcome" />
                    <Stack.Screen name="onboarding/personal-info" />
                    <Stack.Screen name="onboarding/sobriety-status" />
                    <Stack.Screen name="onboarding/sobriety-timeline" />
                    <Stack.Screen name="onboarding/sobriety-goals" />
                    <Stack.Screen name="onboarding/rehabilitation-goals" />
                    <Stack.Screen name="onboarding/preferences" />
                    <Stack.Screen name="onboarding/completion" />
                </Stack>
            </OnboardingProvider>
        </AuthProvider>
    )
}

export default StackLayout
