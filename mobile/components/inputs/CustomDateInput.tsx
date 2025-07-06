import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Keyboard } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';
import { OfficialWheelPicker } from './WheelDatePicker';

interface CustomDateInputProps {
	value: Date | null;
	onChange: (date: Date) => void;
	placeholder?: string;
	label?: string;
	error?: string;
	minimumDate?: Date;
	maximumDate?: Date;
}

export function CustomDateInput({
	value,
	onChange,
	placeholder = 'Selecione uma data',
	label,
	error,
	minimumDate,
	maximumDate
}: CustomDateInputProps) {
	const [isPickerVisible, setIsPickerVisible] = useState(false);
	const [displayValue, setDisplayValue] = useState<Date | null>(value);

	const formatDate = (date: Date) => {
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	};

	const handleOpenPicker = () => {
		Keyboard.dismiss();
		setIsPickerVisible(true);
	};

	const handleClosePicker = () => {
		setIsPickerVisible(false);

		if (value) {
			setDisplayValue(value);
		}
	};

	const handleDateChange = (date: Date) => {
		onChange(date);
	};

	return (
		<View style={styles.container}>
			{label && <Text style={styles.label}>{label}</Text>}
			<Pressable
				style={[
					styles.input,
					error && styles.inputError,
					isPickerVisible && !error && styles.inputFocused
				]}
				onPress={handleOpenPicker}
			>
				<Text style={[
					styles.inputText,
					!displayValue && styles.placeholderText
				]}>
					{displayValue ? formatDate(displayValue) : placeholder}
				</Text>
			</Pressable>
			{error && <Text style={styles.errorText}>{error}</Text>}

			<OfficialWheelPicker
				value={value || new Date()}
				onChange={handleDateChange}
				onClose={handleClosePicker}
				visible={isPickerVisible}
				minimumDate={minimumDate}
				maximumDate={maximumDate}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		gap: 8,
	},
	label: {
		fontSize: 14,
		fontWeight: '500',
		color: Colors.light.text,
	},
	input: {
		height: 48,
		borderWidth: 1,
		borderColor: Colors.light.shadow,
		borderRadius: 8,
		paddingHorizontal: 16,
		backgroundColor: Colors.light.background,
		justifyContent: 'center',
	},
	inputFocused: {
		borderColor: Colors.containers.blue,
	},
	inputError: {
		borderColor: '#FF0000',
	},
	inputText: {
		fontSize: 16,
		color: Colors.light.text,
	},
	placeholderText: {
		color: Colors.icon.gray,
	},
	errorText: {
		fontSize: 12,
		color: '#FF0000',
		marginTop: 4,
	},
}); 