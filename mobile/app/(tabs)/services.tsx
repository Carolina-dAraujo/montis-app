import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/mobile/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface CareOption {
	id: string;
	title: string;
	description: string;
	image: any;
	color: string;
}

const careOptions: CareOption[] = [
	{
		id: 'aa',
		title: 'Alcoólicos Anônimos (AA)',
		description: 'Irmandade de pessoas que compartilham, entre si, suas experiências, forças e esperanças, a fim de resolver seu problema comum e ajudar outros a se recuperarem do alcoolismo.',
		image: require('@/mobile/assets/images/aa.png'),
		color: '#007AFF',
	},
	{
		id: 'caps',
		title: 'Centro de Atenção Psicossocial (CAPS)',
		description: 'Instituição que oferece serviços de saúde abertos à comunidade. Trabalha para atender às necessidades de saúde mental, inclusive para pessoas que enfrentam desafios decorrentes do uso prejudicial de álcool.',
		image: require('@/mobile/assets/images/caps.png'),
		color: '#34C759',
	},
];

export default function ServicesScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();

	const handleOptionPress = (option: CareOption) => {
		router.push(`/services/${option.id}`);
	};

	return (
		<SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
			<View style={styles.header}>
				<Text style={styles.title}>Encontrar serviços</Text>
				<Text style={styles.subtitle}>
					Encontre os serviços de apoio mais próximos de você
				</Text>
			</View>

			<View style={styles.options}>
				{careOptions.map((option) => (
					<TouchableOpacity
						key={option.id}
						style={styles.option}
						onPress={() => handleOptionPress(option)}
					>
						<Image
							source={option.image}
							style={styles.serviceImage}
							resizeMode="contain"
						/>
						<View style={styles.optionContent}>
							<Text style={styles.optionTitle}>{option.title}</Text>
							<Text style={styles.optionDescription}>{option.description}</Text>
						</View>
						<MaterialCommunityIcons
							name="chevron-right"
							size={20}
							color={Colors.icon.gray}
						/>
					</TouchableOpacity>
				))}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	header: {
		padding: 20,
		paddingBottom: 32,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: Colors.light.text,
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: Colors.icon.gray,
	},
	options: {
		paddingHorizontal: 20,
	},
	option: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16,
	},
	serviceImage: {
		width: 40,
		height: 40,
		marginRight: 16,
	},
	optionContent: {
		flex: 1,
	},
	optionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.light.text,
		marginBottom: 4,
	},
	optionDescription: {
		fontSize: 14,
		color: Colors.icon.gray,
	},
});
