import { View, Text, TouchableOpacity, SafeAreaView, Image, ImageSourcePropType, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/shared/theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getTabBarScrollPadding } from '@/shared/components/ui/tabBarMetrics';
import { styles } from '@/features/services/styles/services.styles';

interface CareOption {
	id: string;
	title: string;
	description: string;
	image: ImageSourcePropType;
	color: string;
}

const careOptions: CareOption[] = [
	{
		id: 'aa',
		title: 'Alcoólicos Anônimos (AA)',
		description: 'Irmandade de pessoas que compartilham entre si suas experiências, forças e esperanças, a fim de resolver seu problema comum e ajudar outros a se recuperarem do alcoolismo.',
		image: require('@/assets/images/aa.png'),
		color: '#007AFF',
	},
	{
		id: 'caps',
		title: 'Centro de Atenção Psicossocial (CAPS)',
		description: 'Instituição que oferece serviços de saúde abertos à comunidade. Trabalha para atender às necessidades de saúde mental, inclusive para pessoas que enfrentam desafios decorrentes do uso prejudicial de álcool.',
		image: require('@/assets/images/caps.png'),
		color: '#34C759',
	},
];

export default function Services() {
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

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: getTabBarScrollPadding(insets.bottom),
				}}
			>
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
			</ScrollView>
		</SafeAreaView>
	);
}
