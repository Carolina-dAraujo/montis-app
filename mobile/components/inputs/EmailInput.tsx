import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';

interface EmailInputProps {
	value: string;
	onChangeText: (text: string) => void;
	error?: string | null;
	placeholder: string;
}

export const validateEmail = (value: string): { isValid: boolean; error?: string } => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!value.trim()) {
		return { isValid: false, error: 'Email não pode estar vazio' };
	}
	if (!emailRegex.test(value)) {
		return { isValid: false, error: 'Email inválido' };
	}
	return { isValid: true };
};

export const EmailInput: React.FC<EmailInputProps> = ({ value, onChangeText, error, placeholder }) => {
	return (
		<View>
			<TextInput
				style={[styles.input, error && styles.inputError]}
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor={Colors.icon.gray}
				keyboardType="email-address"
				autoCapitalize="none"
				autoCorrect={false}
				autoFocus
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	input: {
		height: 48,
		borderWidth: 1,
		borderColor: Colors.containers.blue,
		borderRadius: 8,
		paddingHorizontal: 16,
		fontSize: 16,
		color: Colors.light.text,
	},
	inputError: {
		borderColor: '#FF3B30',
	},
	errorText: {
		color: '#FF3B30',
		fontSize: 12,
		marginTop: 4,
	},
});
