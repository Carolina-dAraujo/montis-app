import React, { useState, forwardRef } from 'react';
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
		return { isValid: false, error: 'Formato de email inválido' };
	}
	return { isValid: true };
};

export const EmailInput = forwardRef<TextInput, EmailInputProps>(({ value, onChangeText, error, placeholder }, ref) => {
	const [isFocused, setIsFocused] = useState(false);

	return (
		<View>
			<TextInput
				ref={ref}
				style={[
					styles.input,
					error && styles.inputError,
					isFocused && !error && styles.inputFocused
				]}
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor={Colors.icon.gray}
				keyboardType="email-address"
				autoCapitalize="none"
				autoCorrect={false}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
			/>
		</View>
	);
});

const styles = StyleSheet.create({
	input: {
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
	errorText: {
		color: '#FF3B30',
		fontSize: 12,
		marginTop: 4,
	},
});
