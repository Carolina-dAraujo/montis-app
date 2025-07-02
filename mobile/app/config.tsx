import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ConfigCard } from '@/mobile/components/config/ConfigCard';
import { Colors } from '@/mobile/constants/Colors';
import { ChevronLeft } from '@/mobile/components/icons/ChevronLeft';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConfigScreen() {
	const router = useRouter();

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<View style={styles.backIconContainer}>
						<ChevronLeft onPress={() => router.back()} />
					</View>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Configurações</Text>
					</View>
				</View>
			</View>
			<ScrollView style={styles.content}>
				<ConfigCard
					icon="circle-user"
					title="Conta"
					onPress={() => {
						router.push('/(config)/accountData');
					}}
				/>
				<ConfigCard
					icon="screwdriver-wrench"
					title="Preferências"
					onPress={() => {
						// TODO: Navigate to preferences
					}}
				/>
				<ConfigCard
					icon="unlock"
					title="Permissões"
					onPress={() => {
						// TODO: Navigate to permissions
					}}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	header: {
		paddingBottom: 28,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	backIconContainer: {
		paddingTop: 8,
	},
	titleContainer: {
		paddingTop: 8,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		gap: 24,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: Colors.light.text,
	},
});