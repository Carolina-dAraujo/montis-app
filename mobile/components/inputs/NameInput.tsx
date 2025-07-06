import React, { useState, forwardRef } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';

interface NameInputProps {
	value: string;
	onChangeText: (text: string) => void;
	error?: string | null;
	placeholder: string;
}

export const validateName = (value: string): { isValid: boolean; error?: string } => {
	if (!value.trim()) {
		return { isValid: false, error: 'Nome não pode estar vazio' };
	}
	if (value.trim().length < 2) {
		return { isValid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
	}
	return { isValid: true };
};

export const NameInput = forwardRef<TextInput, NameInputProps>(({ value, onChangeText, error, placeholder }, ref) => {
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
				keyboardType="default"
				autoCapitalize="words"
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
