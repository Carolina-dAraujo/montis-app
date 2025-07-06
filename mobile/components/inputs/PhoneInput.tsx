import React, { useState, forwardRef } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';

interface PhoneInputProps {
	value: string;
	onChangeText: (text: string) => void;
	error?: string | null;
	placeholder: string;
}

const formatPhoneNumber = (text: string): string => {
	const numbers = text.replace(/\D/g, '');
	if (numbers.length <= 2) {
		return numbers;
	}
	if (numbers.length <= 7) {
		return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
	}
	return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

export const validatePhone = (value: string): { isValid: boolean; error?: string } => {
	const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
	if (!value.trim()) {
		return { isValid: false, error: 'Número de celular não pode estar vazio' };
	}
	if (!phoneRegex.test(value)) {
		return { isValid: false, error: 'Formato inválido. Use (00) 00000-0000' };
	}
	return { isValid: true };
};

export const PhoneInput = forwardRef<TextInput, PhoneInputProps>(({ value, onChangeText, error, placeholder }, ref) => {
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
				onChangeText={(text) => onChangeText(formatPhoneNumber(text))}
				placeholder={placeholder}
				placeholderTextColor={Colors.icon.gray}
				keyboardType="phone-pad"
				maxLength={15}
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
