import { Tabs } from "expo-router"
import React from "react"
import TabBar from "components/ui/TabBar"

export default () => {
    return (
        <Tabs
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