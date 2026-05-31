import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { CrisisSeverity, NewCrisisEntry, CRISIS_SEVERITY_COLORS, CRISIS_SEVERITY_LABELS } from '@/features/crisisSupport/types/crisisLog';
import { styles } from '@/features/crisisSupport/styles/crisisLog.styles';

type CrisisLogEntryFormProps = {
	entry: NewCrisisEntry;
	onChange: (entry: NewCrisisEntry) => void;
	onSave: () => void;
	onCancel: () => void;
};

export function CrisisLogEntryForm({ entry, onChange, onSave, onCancel }: CrisisLogEntryFormProps) {
	return (
		<View style={styles.addEntryForm}>
			<Text style={styles.formTitle}>Adicionar Entrada</Text>

			<View style={styles.severitySelector}>
				<Text style={styles.inputLabel}>Severidade:</Text>
				<View style={styles.severityButtons}>
					{(['low', 'medium', 'high'] as const).map((severity) => (
						<TouchableOpacity
							key={severity}
							style={[
								styles.severityButton,
								entry.severity === severity && { backgroundColor: CRISIS_SEVERITY_COLORS[severity] },
							]}
							onPress={() => onChange({ ...entry, severity })}
						>
							<Text
								style={[
									styles.severityButtonText,
									entry.severity === severity && { color: 'white' },
								]}
							>
								{CRISIS_SEVERITY_LABELS[severity]}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</View>

			<TextInput
				style={styles.input}
				placeholder="Gatilhos (o que causou a crise?)"
				value={entry.triggers}
				onChangeText={(triggers) => onChange({ ...entry, triggers })}
				multiline
			/>

			<TextInput
				style={styles.input}
				placeholder="Sintomas (como você se sentiu?)"
				value={entry.symptoms}
				onChangeText={(symptoms) => onChange({ ...entry, symptoms })}
				multiline
			/>

			<TextInput
				style={styles.input}
				placeholder="Estratégias de coping (o que ajudou?)"
				value={entry.copingStrategies}
				onChangeText={(copingStrategies) => onChange({ ...entry, copingStrategies })}
				multiline
			/>

			<TextInput
				style={styles.input}
				placeholder="Notas adicionais (opcional)"
				value={entry.notes}
				onChangeText={(notes) => onChange({ ...entry, notes })}
				multiline
			/>

			<View style={styles.formActions}>
				<TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
					<Text style={styles.cancelButtonText}>Cancelar</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.saveButton} onPress={onSave}>
					<Text style={styles.saveButtonText}>Salvar</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
