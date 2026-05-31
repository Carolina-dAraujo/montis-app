import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ConfigCard } from '@/features/settings/components/ConfigCard';
import { ConfigHeader } from '@/features/settings/components/ConfigHeader';
import { styles } from '@/features/settings/styles/configMenu.styles';

export default function ConfigMenu() {
	const router = useRouter();

	return (
		<SafeAreaView style={styles.container}>
			<ConfigHeader title="Configurações" onBack={() => router.back()} />
			<ScrollView style={styles.content}>
				<ConfigCard
					icon="circle-user"
					title="Conta"
					onPress={() => router.push('/(config)/account-data')}
				/>
				<ConfigCard
					icon="screwdriver-wrench"
					title="Preferências"
					onPress={() => router.push('/(config)/preferences')}
				/>
				<ConfigCard
					icon="unlock"
					title="Permissões"
					onPress={() => router.push('/(config)/permissions')}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}
