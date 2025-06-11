import TabBar from "components/ui/TabBar"
import { Tabs } from "expo-router"

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false
            }}
            tabBar={props => <TabBar {...props}/>}>
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home"
                }}
            />
            <Tabs.Screen
                name="grupos"
                options={{
                    title: "Grupos"
                }}
            />
            <Tabs.Screen
                name="crise"
                options={{
                    title: "Crise"
                }}
            />
            <Tabs.Screen
                name="agenda"
                options={{
                    title: "Agenda"
                }}
            />
            <Tabs.Screen
                name="ajuda"
                options={{
                    title: "Ajuda"
                }}
            />
        </Tabs>
    )
}