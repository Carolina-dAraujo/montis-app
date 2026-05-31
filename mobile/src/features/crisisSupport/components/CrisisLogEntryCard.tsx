import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/shared/theme/colors';
import {
	CrisisEntry,
	CRISIS_SEVERITY_COLORS,
	CRISIS_SEVERITY_LABELS,
} from '@/features/crisisSupport/types/crisisLog';
import { styles } from '@/features/crisisSupport/styles/crisisLog.styles';

type CrisisLogEntryCardProps = {
	entry: CrisisEntry;
	formattedDate: string;
	onDelete: (id: string) => void;
};

export function CrisisLogEntryCard({ entry, formattedDate, onDelete }: CrisisLogEntryCardProps) {
	return (
		<View style={styles.entryCard}>
			<View style={styles.entryHeader}>
				<View style={styles.entryDateInfo}>
					<Text style={styles.entryDate}>{formattedDate}</Text>
					<Text style={styles.entryTime}>{entry.time}</Text>
				</View>
				<View style={[styles.severityBadge, { backgroundColor: CRISIS_SEVERITY_COLORS[entry.severity] }]}>
					<Text style={styles.severityText}>{CRISIS_SEVERITY_LABELS[entry.severity]}</Text>
				</View>
			</View>

			<View style={styles.entrySection}>
				<Text style={styles.sectionLabel}>Gatilhos:</Text>
				<Text style={styles.sectionText}>{entry.triggers}</Text>
			</View>

			<View style={styles.entrySection}>
				<Text style={styles.sectionLabel}>Sintomas:</Text>
				<Text style={styles.sectionText}>{entry.symptoms}</Text>
			</View>

			{entry.copingStrategies ? (
				<View style={styles.entrySection}>
					<Text style={styles.sectionLabel}>Estratégias de Coping:</Text>
					<Text style={styles.sectionText}>{entry.copingStrategies}</Text>
				</View>
			) : null}

			{entry.notes ? (
				<View style={styles.entrySection}>
					<Text style={styles.sectionLabel}>Notas:</Text>
					<Text style={styles.sectionText}>{entry.notes}</Text>
				</View>
			) : null}

			<TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(entry.id)}>
				<Ionicons name="trash-outline" size={16} color={Colors.light.iconAlert} />
				<Text style={styles.deleteButtonText}>Remover</Text>
			</TouchableOpacity>
		</View>
	);
}
