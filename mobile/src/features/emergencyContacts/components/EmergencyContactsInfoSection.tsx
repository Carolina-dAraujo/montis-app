import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/shared/theme/colors';
import { styles } from '@/features/emergencyContacts/styles/emergencyContacts.styles';

const INFO_ITEMS = [
	{
		icon: 'shield-checkmark' as const,
		text: 'Os contatos ativos receberão notificações quando você enviar um alerta de emergência.',
	},
	{
		icon: 'notifications' as const,
		text: 'Você pode ativar/desativar contatos individualmente usando o botão de notificação.',
	},
	{
		icon: 'information-circle' as const,
		text: 'Recomendamos adicionar pelo menos 2 contatos de confiança.',
	},
	{
		icon: 'ellipsis-vertical' as const,
		text: 'Toque nos três pontos para editar ou remover um contato.',
	},
];

export function EmergencyContactsInfoSection() {
	return (
		<View style={styles.infoSection}>
			<Text style={styles.infoTitle}>Informações importantes</Text>
			{INFO_ITEMS.map((item) => (
				<View key={item.text} style={styles.infoCard}>
					<Ionicons name={item.icon} size={20} color={Colors.containers.blue} />
					<Text style={styles.infoText}>{item.text}</Text>
				</View>
			))}
		</View>
	);
}
