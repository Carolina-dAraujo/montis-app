import { View, Text, Pressable } from 'react-native';
import { Colors } from '@/shared/theme/colors';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { styles } from '@/features/settings/styles/configCard.styles';

type ConfigCardProps = {
	icon: string;
	title: string;
	onPress: () => void;
};

export function ConfigCard({ icon, title, onPress }: ConfigCardProps) {
	return (
		<Pressable style={styles.container} onPress={onPress}>
			<View>
				<FontAwesome6 solid name={icon} size={40} color={Colors.light.background} />
			</View>
			<View style={styles.contentContainer}>
				<Text style={styles.title}>{title}</Text>
				<View style={styles.separator} />
				<View style={styles.accessContainer}>
					<Text style={styles.accessText}>Acessar {title.toLowerCase()}</Text>
					<FontAwesome6 solid name="chevron-right" size={8} color={Colors.light.background} />
				</View>
			</View>
		</Pressable>
	);
}
