import React from 'react';
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
	return { isValid: true };
};

export const NameInput: React.FC<NameInputProps> = ({ value, onChangeText, error, placeholder }) => {
	return (
		<View>
			<TextInput
				style={[styles.input, error && styles.inputError]}
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor={Colors.icon.gray}
				keyboardType="default"
				autoCapitalize="words"
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
