import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Plus } from 'lucide-react-native';
import { Colors } from '@/shared/theme/colors';
import { EmergencyContact } from '@/features/emergencyContacts/api';
import { EmergencyContactCard } from '@/features/emergencyContacts/components/EmergencyContactCard';
import { styles } from '@/features/emergencyContacts/styles/emergencyContacts.styles';

type EmergencyContactsListBodyProps = {
	contacts: EmergencyContact[];
	loading: boolean;
	onAddContact: () => void;
	onToggleContact: (id: string) => void;
	onShowContactOptions: (contact: EmergencyContact) => void;
};

export function EmergencyContactsListBody({
	contacts,
	loading,
	onAddContact,
	onToggleContact,
	onShowContactOptions,
}: EmergencyContactsListBodyProps) {
	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<View style={styles.loadingIconContainer}>
					<Ionicons name="people-circle" size={48} color={Colors.containers.blue} />
				</View>
				<Text style={styles.loadingText}>Carregando contatos...</Text>
			</View>
		);
	}

	if (contacts.length === 0) {
		return (
			<View style={styles.emptyState}>
				<View style={styles.emptyIconContainer}>
					<Ionicons name="people-circle" size={48} color={Colors.light.icon} />
				</View>
				<Text style={styles.emptyStateText}>Nenhum contato adicionado</Text>
				<Text style={styles.emptyStateSubtext}>
					Adicione contatos de emergência para receber alertas quando necessário
				</Text>
				<TouchableOpacity style={styles.addButtonEmpty} onPress={onAddContact}>
					<Plus size={18} color={Colors.containers.blue} />
					<Text style={styles.addButtonText}>Adicionar contato</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<>
			<FlatList
				data={contacts}
				renderItem={({ item }) => (
					<EmergencyContactCard
						contact={item}
						onToggle={onToggleContact}
						onShowOptions={onShowContactOptions}
					/>
				)}
				keyExtractor={(item) => item.id}
				scrollEnabled={false}
				style={styles.contactsList}
			/>
			<View style={styles.addButtonContainer}>
				<TouchableOpacity style={styles.addButton} onPress={onAddContact}>
					<Plus size={18} color={Colors.containers.blue} />
					<Text style={styles.addButtonText}>Adicionar contato</Text>
				</TouchableOpacity>
			</View>
		</>
	);
}
