import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface PasswordInputProps {
	value: string;
	onChangeText: (text: string) => void;
	error?: string | null;
	placeholder: string;
	confirmValue?: string;
	onConfirmChange?: (text: string) => void;
}

export const validatePassword = (value: string, confirmValue?: string): { isValid: boolean; error?: string } => {
	if (!value.trim()) {
		return { isValid: false, error: 'Senha não pode estar vazia' };
	}
	if (value.length < 8) {
		return { isValid: false, error: 'Senha deve ter pelo menos 8 caracteres' };
	}
	if (!/[A-Z]/.test(value)) {
		return { isValid: false, error: 'Senha deve conter pelo menos uma letra maiúscula' };
	}
	if (!/[a-z]/.test(value)) {
		return { isValid: false, error: 'Senha deve conter pelo menos uma letra minúscula' };
	}
	if (!/[0-9]/.test(value)) {
		return { isValid: false, error: 'Senha deve conter pelo menos um número' };
	}
	if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
		return { isValid: false, error: 'Senha deve conter pelo menos um caractere especial' };
	}
	if (confirmValue && value !== confirmValue) {
		return { isValid: false, error: 'As senhas não coincidem' };
	}
	return { isValid: true };
};

export const PasswordInput: React.FC<PasswordInputProps> = ({
	value,
	onChangeText,
	error,
	placeholder,
	confirmValue,
	onConfirmChange,
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [isConfirmFocused, setIsConfirmFocused] = useState(false);

	return (
		<View>
			{onConfirmChange && (
				<Text style={styles.description}>{placeholder}</Text>
			)}
			<View style={styles.inputContainer}>
				<TextInput
					style={[
						styles.input,
						error && styles.inputError,
						isFocused && !error && styles.inputFocused
					]}
					value={value}
					onChangeText={onChangeText}
					placeholder={onConfirmChange ? 'Digite sua nova senha' : placeholder}
					placeholderTextColor={Colors.icon.gray}
					keyboardType="default"
					secureTextEntry={!showPassword}
					autoCapitalize="none"
					autoCorrect={false}
					autoFocus
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
				/>
				<Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
					<MaterialCommunityIcons
						name={showPassword ? 'eye-outline' : 'eye-off-outline'}
						size={24}
						color={Colors.icon.gray}
					/>
				</Pressable>
			</View>
			{onConfirmChange && (
				<View style={styles.confirmPasswordContainer}>
					<Text style={styles.description}>Confirme sua senha</Text>
					<View style={styles.inputContainer}>
						<TextInput
							style={[
								styles.input,
								error && styles.inputError,
								isConfirmFocused && !error && styles.inputFocused
							]}
							value={confirmValue}
							onChangeText={onConfirmChange}
							placeholder="Digite sua senha novamente"
							placeholderTextColor={Colors.icon.gray}
							keyboardType="default"
							secureTextEntry={!showConfirmPassword}
							autoCapitalize="none"
							autoCorrect={false}
							onFocus={() => setIsConfirmFocused(true)}
							onBlur={() => setIsConfirmFocused(false)}
						/>
						<Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
							<MaterialCommunityIcons
								name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
								size={24}
								color={Colors.icon.gray}
							/>
						</Pressable>
					</View>
				</View>
			)}
			{onConfirmChange && (
				<View style={styles.passwordRules}>
					<Text style={styles.rulesTitle}>Sua senha deve conter:</Text>
					<View style={styles.ruleItem}>
						<Text style={[styles.ruleText, value.length >= 8 && styles.ruleMet]}>• Mínimo de 8 caracteres</Text>
					</View>
					<View style={styles.ruleItem}>
						<Text style={[styles.ruleText, /[A-Z]/.test(value) && styles.ruleMet]}>• Pelo menos uma letra maiúscula</Text>
					</View>
					<View style={styles.ruleItem}>
						<Text style={[styles.ruleText, /[a-z]/.test(value) && styles.ruleMet]}>• Pelo menos uma letra minúscula</Text>
					</View>
					<View style={styles.ruleItem}>
						<Text style={[styles.ruleText, /[0-9]/.test(value) && styles.ruleMet]}>• Pelo menos um número</Text>
					</View>
					<View style={styles.ruleItem}>
						<Text style={[styles.ruleText, /[!@#$%^&*(),.?":{}|<>]/.test(value) && styles.ruleMet]}>• Pelo menos um caractere especial</Text>
					</View>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		position: 'relative',
	},
	input: {
		flex: 1,
		height: 48,
		borderWidth: 1,
		borderColor: Colors.light.shadow,
		borderRadius: 8,
		paddingHorizontal: 16,
		fontSize: 16,
		color: Colors.light.text,
		backgroundColor: Colors.light.background,
	},
	inputFocused: {
		borderColor: Colors.containers.blue,
	},
	inputError: {
		borderColor: '#FF3B30',
	},
	eyeButton: {
		position: 'absolute',
		right: 16,
		padding: 4,
		zIndex: 1,
	},
	description: {
		fontSize: 16,
		marginBottom: 16,
		color: Colors.icon.gray,
	},
	passwordRules: {
		marginTop: 32,
		padding: 20,
		backgroundColor: Colors.lightGray,
		borderRadius: 12,
	},
	rulesTitle: {
		fontSize: 14,
		fontWeight: '500',
		color: Colors.light.text,
		marginBottom: 12,
	},
	ruleItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	ruleText: {
		fontSize: 14,
		color: Colors.icon.gray,
	},
	ruleMet: {
		color: '#34C759',
	},
	confirmPasswordContainer: {
		marginTop: 16,
	},
});
