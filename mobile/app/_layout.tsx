import { Stack } from "expo-router"
import { AuthProvider } from "../contexts/AuthContext"

const StackLayout = () => {
    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)/cadastro" />
                <Stack.Screen name="(auth)/login" />
                <Stack.Screen name="tracking/[date]" />
            </Stack>
        </AuthProvider>
    )
}

export default StackLayout