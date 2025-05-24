import { Tabs } from "expo-router"
import TabBar from "components/ui/TabBar"

export default () => {
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