import TabBar from '@/shared/components/ui/TabBar';
import { Tabs } from 'expo-router';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
			}}
			tabBar={(props) => <TabBar {...props} />}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: 'Home',
				}}
			/>
			<Tabs.Screen
				name="groups"
				options={{
					title: 'Grupos',
				}}
			/>
			<Tabs.Screen
				name="crisis"
				options={{
					title: 'Crise',
				}}
			/>
			<Tabs.Screen
				name="agenda"
				options={{
					title: 'Agenda',
				}}
			/>
			<Tabs.Screen
				name="services"
				options={{
					title: 'Serviços',
				}}
			/>
		</Tabs>
	);
}
