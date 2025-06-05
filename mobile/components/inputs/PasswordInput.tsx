import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState, useRef } from 'react';

interface PasswordInputProps {
	value: string;
	onChange: (newPassword: string) => void;
	label: string;
	isEditing: boolean;
	onEdit: () => void;
}

export function PasswordInput({ value, onChange, label, isEditing, onEdit }: PasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<TextInput>(null);

	const validatePassword = (pass: string) => {
		if (pass.length < 8) {
			return 'A senha deve ter pelo menos 8 caracteres';
		}
		if (!/[A-Z]/.test(pass)) {
			return 'A senha deve conter pelo menos uma letra maiúscula';
		}
		if (!/[a-z]/.test(pass)) {
			return 'A senha deve conter pelo menos uma letra minúscula';
		}
		if (!/[0-9]/.test(pass)) {
			return 'A senha deve conter pelo menos um número';
		}
		if (!/[!@#$%^&*]/.test(pass)) {
			return 'A senha deve conter pelo menos um caractere especial (!@#$%^&*)';
		}
		return null;
	};

	const handlePasswordChange = () => {
		const error = validatePassword(newPassword);
		if (error) {
			setError(error);
			return;
		}

		if (newPassword !== confirmPassword) {
			setError('As senhas não coincidem');
			return;
		}

		onChange(newPassword);
		setNewPassword('');
		setConfirmPassword('');
		onEdit();
		setError(null);
	};

	return (
		<Pressable 
			style={styles.inputGroup}
			onPress={() => {
				if (isEditing) {
					setNewPassword('');
					setConfirmPassword('');
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
					placeholder="••••••••"
					placeholderTextColor={Colors.icon.gray}
					secureTextEntry={!showPassword}
					value={isEditing ? newPassword : value}
					onChangeText={setNewPassword}
					editable={isEditing}
					autoComplete="off"
					autoCorrect={false}
					autoCapitalize="none"
					textContentType="none"
					onFocus={() => {
						if (isEditing) {
							inputRef.current?.setNativeProps({
								selection: { start: newPassword.length, end: newPassword.length }
							});
						}
					}}
				/>
				<View style={styles.actions}>
					<Pressable
						style={styles.eyeIcon}
						onPress={() => setShowPassword(!showPassword)}
					>
						<FontAwesome6
							name={showPassword ? 'eye-slash' : 'eye'}
							size={16}
							color={Colors.icon.gray}
						/>
					</Pressable>
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
			{isEditing && (
				<>
					<View style={styles.inputContainer}>
						<TextInput
							style={[styles.input, error && styles.inputError]}
							placeholder="Confirmar nova senha"
							placeholderTextColor={Colors.icon.gray}
							secureTextEntry={!showPassword}
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							editable={isEditing}
							autoComplete="off"
							autoCorrect={false}
							autoCapitalize="none"
							textContentType="none"
						/>
					</View>
					<View style={styles.rulesContainer}>
						<Text style={styles.rulesTitle}>A senha deve conter:</Text>
						<Text style={[styles.rule, newPassword.length >= 8 && styles.ruleMet]}>• Pelo menos 8 caracteres</Text>
						<Text style={[styles.rule, /[A-Z]/.test(newPassword) && styles.ruleMet]}>• Uma letra maiúscula</Text>
						<Text style={[styles.rule, /[a-z]/.test(newPassword) && styles.ruleMet]}>• Uma letra minúscula</Text>
						<Text style={[styles.rule, /[0-9]/.test(newPassword) && styles.ruleMet]}>• Um número</Text>
						<Text style={[styles.rule, /[!@#$%^&*]/.test(newPassword) && styles.ruleMet]}>• Um caractere especial (!@#$%^&*)</Text>
					</View>
					{error && <Text style={styles.errorText}>{error}</Text>}
				</>
			)}
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
		borderColor: 'rgba(0, 122, 255, 0.3)', // Lighter blue color
	},
	actions: {
		position: 'absolute',
		right: 8,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		height: 48,
		justifyContent: 'center',
	},
	eyeIcon: {
		padding: 8,
		height: '100%',
		justifyContent: 'center',
	},
	editButton: {
		padding: 8,
		height: '100%',
		justifyContent: 'center',
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
	rulesContainer: {
		marginTop: 12,
		padding: 12,
		backgroundColor: Colors.input,
		borderRadius: 8,
		gap: 4,
	},
	rulesTitle: {
		fontSize: 12,
		color: Colors.light.text,
		fontWeight: '500',
		marginBottom: 4,
	},
	rule: {
		fontSize: 12,
		color: Colors.icon.gray,
	},
	ruleMet: {
		color: Colors.containers.blue,
	},
}); 