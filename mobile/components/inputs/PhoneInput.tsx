import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';
import { useState, useRef } from 'react';

interface PhoneInputProps {
	value: string;
	onChange: (newPhone: string) => void;
	label: string;
	isEditing: boolean;
	onEdit: () => void;
}

export function PhoneInput({ value, onChange, label, isEditing, onEdit }: PhoneInputProps) {
	const [phone, setPhone] = useState(value);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<TextInput>(null);

	const formatPhoneNumber = (text: string) => {
		const numbers = text.replace(/\D/g, '');

		if (numbers.length <= 2) {
			return numbers;
		} else if (numbers.length <= 7) {
			return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
		} else {
			return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
		}
	};

	const validatePhone = (phone: string) => {
		const numbers = phone.replace(/\D/g, '');
		if (numbers.length !== 11) {
			return 'Número de telefone inválido';
		}
		return null;
	};

	const handlePhoneChange = (text: string) => {
		const formatted = formatPhoneNumber(text);
		setPhone(formatted);
		setError(null);
	};

	const handleSave = () => {
		const error = validatePhone(phone);
		if (error) {
			setError(error);
			return;
		}

		onChange(phone);
		onEdit();
	};

	return (
		<View style={styles.inputGroup}>
			<Text style={styles.label}>{label}</Text>
			<View style={styles.inputContainer}>
				<TextInput
					ref={inputRef}
					style={[
						styles.input,
						error && styles.inputError,
						isEditing && styles.inputEditing
					]}
					placeholder="(00) 00000-0000"
					placeholderTextColor={Colors.icon.gray}
					keyboardType="numeric"
					value={phone}
					onChangeText={handlePhoneChange}
					maxLength={15}
					editable={isEditing}
					onFocus={() => {
						if (isEditing) {
							inputRef.current?.setNativeProps({
								selection: { start: phone.length, end: phone.length }
							});
						}
					}}
				/>
				{!isEditing && (
					<Pressable
						style={styles.editButton}
						onPress={onEdit}
					>
						<Text style={styles.editButtonText}>Editar</Text>
					</Pressable>
				)}
			</View>
			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	inputGroup: {
		gap: 8,
	},
	label: {
		fontSize: 14,
		color: Colors.light.text,
		fontWeight: '500',
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	input: {
		flex: 1,
		height: 48,
		backgroundColor: Colors.input,
		borderRadius: 12,
		paddingHorizontal: 16,
		fontSize: 16,
		color: Colors.light.text,
		paddingRight: 80,
		borderWidth: 1,
		borderColor: 'transparent',
	},
	inputError: {
		borderColor: Colors.light.iconAlert,
	},
	inputEditing: {
		borderColor: 'rgba(0, 122, 255, 0.3)',
	},
	editButton: {
		position: 'absolute',
		right: 8,
		padding: 8,
	},
	editButtonText: {
		color: Colors.containers.blue,
		fontSize: 14,
		fontWeight: '500',
	},
	errorText: {
		color: Colors.light.iconAlert,
		fontSize: 12,
		marginTop: 4,
	},
});