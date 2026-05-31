import { View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User, Phone, Heart } from 'lucide-react-native';
import { Colors } from '@/shared/theme/colors';
import { styles } from '@/features/emergencyContacts/styles/emergencyContactForm.styles';

export type EmergencyContactFormValues = {
	name: string;
	phone: string;
	relationship: string;
};

type EmergencyContactFormFieldsProps = {
	values: EmergencyContactFormValues;
	focusedInput: string | null;
	heroTitle: string;
	heroSubtitle: string;
	onChange: (field: keyof EmergencyContactFormValues, value: string) => void;
	onFocus: (field: string) => void;
	onBlur: () => void;
};

export function EmergencyContactFormFields({
	values,
	focusedInput,
	heroTitle,
	heroSubtitle,
	onChange,
	onFocus,
	onBlur,
}: EmergencyContactFormFieldsProps) {
	return (
		<>
			<View style={styles.heroSection}>
				<View style={styles.iconContainer}>
					<Ionicons name="people-circle" size={48} color={Colors.containers.blue} />
				</View>
				<Text style={styles.heroTitle}>{heroTitle}</Text>
				<Text style={styles.heroSubtitle}>{heroSubtitle}</Text>
			</View>

			<View style={styles.formSection}>
				<View style={styles.inputContainer}>
					<View style={styles.inputLabel}>
						<User size={16} color={Colors.light.icon} />
						<Text style={styles.labelText}>Nome completo</Text>
					</View>
					<TextInput
						style={[styles.input, focusedInput === 'name' && styles.inputFocused]}
						placeholder="Digite o nome completo"
						placeholderTextColor="#9CA3AF"
						value={values.name}
						onChangeText={(text) => onChange('name', text)}
						onFocus={() => onFocus('name')}
						onBlur={onBlur}
						autoCapitalize="words"
						autoComplete="name"
					/>
				</View>

				<View style={styles.inputContainer}>
					<View style={styles.inputLabel}>
						<Phone size={16} color={Colors.light.icon} />
						<Text style={styles.labelText}>Telefone</Text>
					</View>
					<TextInput
						style={[styles.input, focusedInput === 'phone' && styles.inputFocused]}
						placeholder="(11) 99999-9999"
						placeholderTextColor="#9CA3AF"
						value={values.phone}
						onChangeText={(text) => onChange('phone', text)}
						onFocus={() => onFocus('phone')}
						onBlur={onBlur}
						keyboardType="phone-pad"
						autoComplete="tel"
						maxLength={15}
					/>
				</View>

				<View style={styles.inputContainer}>
					<View style={styles.inputLabel}>
						<Heart size={16} color={Colors.light.icon} />
						<Text style={styles.labelText}>Relacionamento</Text>
					</View>
					<TextInput
						style={[styles.input, focusedInput === 'relationship' && styles.inputFocused]}
						placeholder="Ex: Mãe, Pai, Amigo, Irmão"
						placeholderTextColor="#9CA3AF"
						value={values.relationship}
						onChangeText={(text) => onChange('relationship', text)}
						onFocus={() => onFocus('relationship')}
						onBlur={onBlur}
						autoCapitalize="words"
					/>
				</View>
			</View>

			<View style={styles.infoSection}>
				<View style={styles.infoCard}>
					<Ionicons name="shield-checkmark" size={20} color={Colors.containers.blue} />
					<Text style={styles.infoText}>
						Este contato receberá notificações quando você enviar um alerta de emergência
					</Text>
				</View>
				<View style={styles.infoCard}>
					<Ionicons name="notifications" size={20} color={Colors.containers.blue} />
					<Text style={styles.infoText}>
						Você pode ativar ou desativar as notificações a qualquer momento
					</Text>
				</View>
			</View>
		</>
	);
}
