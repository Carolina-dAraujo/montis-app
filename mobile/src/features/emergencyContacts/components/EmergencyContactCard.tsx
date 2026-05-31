import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Phone, Heart } from 'lucide-react-native';
import { Colors } from '@/shared/theme/colors';
import { EmergencyContact } from '@/features/emergencyContacts/api';
import { styles } from '@/features/emergencyContacts/styles/emergencyContacts.styles';

type EmergencyContactCardProps = {
	contact: EmergencyContact;
	onToggle: (id: string) => void;
	onShowOptions: (contact: EmergencyContact) => void;
};

export function EmergencyContactCard({ contact, onToggle, onShowOptions }: EmergencyContactCardProps) {
	return (
		<View style={styles.contactCard}>
			<View style={styles.contactAvatar}>
				<Ionicons
					name="person"
					size={24}
					color={contact.isActive ? Colors.containers.blue : Colors.light.icon}
				/>
			</View>

			<View style={styles.contactInfo}>
				<View style={styles.contactHeader}>
					<Text style={styles.contactName}>{contact.name}</Text>
					<View style={[styles.statusBadge, contact.isActive && styles.statusActive]}>
						<Text style={[styles.statusText, contact.isActive && styles.statusTextActive]}>
							{contact.isActive ? 'Ativo' : 'Inativo'}
						</Text>
					</View>
				</View>

				<View style={styles.contactDetails}>
					<View style={styles.detailRow}>
						<Phone size={14} color={Colors.light.icon} />
						<Text style={styles.contactPhone}>{contact.phone}</Text>
					</View>
					<View style={styles.detailRow}>
						<Heart size={14} color={Colors.light.icon} />
						<Text style={styles.contactRelationship}>{contact.relationship}</Text>
					</View>
				</View>
			</View>

			<View style={styles.contactActions}>
				<TouchableOpacity
					style={[styles.actionButton, styles.toggleButton]}
					onPress={() => onToggle(contact.id)}
				>
					<Ionicons
						name={contact.isActive ? 'notifications' : 'notifications-off'}
						size={20}
						color={contact.isActive ? Colors.containers.blue : Colors.light.icon}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.actionButton, styles.moreButton]}
					onPress={() => onShowOptions(contact)}
				>
					<Ionicons name="ellipsis-vertical" size={20} color={Colors.light.icon} />
				</TouchableOpacity>
			</View>
		</View>
	);
}
