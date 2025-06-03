import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';
import { useState, useRef } from 'react';

interface EmailInputProps {
	value: string;
	onChange: (newEmail: string) => void;
	label: string;
	isEditing: boolean;
	onEdit: () => void;
}

export function EmailInput({ value, onChange, label, isEditing, onEdit }: EmailInputProps) {
	const [email, setEmail] = useState(value);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<TextInput>(null);

	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return 'Email inválido';
		}
		return null;
	};

	const handleEmailChange = (text: string) => {
		setEmail(text);
		setError(null);
	};

	const handleSave = () => {
		const error = validateEmail(email);
		if (error) {
			setError(error);
			return;
		}

		onChange(email);
		onEdit();
	};

	return (
		<Pressable 
			style={styles.inputGroup}
			onPress={() => {
				if (isEditing) {
					setEmail(value);
					setError(null);
					onEdit();
				}
			}}
		>
			<Text style={styles.label}>{label}</Text>
			<View style={styles.inputContainer}>
				<TextInput
					ref={inputRef}
					style={[
						styles.input,
						error && styles.inputError,
						isEditing && styles.inputEditing
					]}
					placeholder="seu@email.com"
					placeholderTextColor={Colors.icon.gray}
					keyboardType="email-address"
					autoCapitalize="none"
					autoCorrect={false}
					value={email}
					onChangeText={handleEmailChange}
					editable={isEditing}
					onFocus={() => {
						if (isEditing) {
							inputRef.current?.setNativeProps({
								selection: { start: email.length, end: email.length }
							});
						}
					}}
				/>
				<View style={styles.actions}>
					{!isEditing && (
						<Pressable
							style={styles.editButton}
							onPress={onEdit}
						>
							<Text style={styles.editButtonText}>Editar</Text>
						</Pressable>
					)}
				</View>
			</View>
			{error && <Text style={styles.errorText}>{error}</Text>}
		</Pressable>
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
	actions: {
		flexDirection: 'row',
		alignItems: 'center',
	},
}); 