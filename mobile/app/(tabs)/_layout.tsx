import { Tabs } from "expo-router"

export default () => {
    return (
        <Tabs>
            <Tabs.Screen name="home" />
            <Tabs.Screen name="grupos" />
            <Tabs.Screen name="crise" />
            <Tabs.Screen name="agenda" />
            <Tabs.Screen name="ajuda" />
        </Tabs>
    )
}