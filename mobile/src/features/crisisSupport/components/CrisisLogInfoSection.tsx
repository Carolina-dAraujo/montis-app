import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/shared/theme/colors';
import { styles } from '@/features/crisisSupport/styles/crisisLog.styles';

export function CrisisLogInfoSection() {
	return (
		<View style={styles.infoSection}>
			<Text style={styles.infoTitle}>Por que registrar crises?</Text>
			<View style={styles.infoCard}>
				<Ionicons name="analytics" size={20} color={Colors.light.tint} />
				<Text style={styles.infoText}>
					Identificar padrões nos seus gatilhos e sintomas
				</Text>
			</View>
			<View style={styles.infoCard}>
				<Ionicons name="trending-up" size={20} color={Colors.light.tint} />
				<Text style={styles.infoText}>
					Acompanhar a eficácia das suas estratégias de coping
				</Text>
			</View>
		</View>
	);
}
