import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';
import { BottomSheet } from '@/mobile/components/ui/BottomSheet';
import { Picker } from '@react-native-picker/picker';

interface OfficialWheelPickerProps {
	value: Date | null;
	onChange: (date: Date) => void;
	onClose: () => void;
	visible: boolean;
	minimumDate?: Date;
	maximumDate?: Date;
}

export function OfficialWheelPicker({
	value,
	onChange,
	onClose,
	visible,
	minimumDate = new Date(1900, 0, 1),
	maximumDate = new Date()
}: OfficialWheelPickerProps) {
	const [selectedDay, setSelectedDay] = useState(value?.getDate() || 1);
	const [selectedMonth, setSelectedMonth] = useState(value?.getMonth() || 0);
	const [selectedYear, setSelectedYear] = useState(value?.getFullYear() || new Date().getFullYear());

	const months = [
		'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
		'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
	];

	const generateDays = (month: number, year: number) => {
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		return Array.from({ length: daysInMonth }, (_, i) => i + 1);
	};

	const generateYears = () => {
		const startYear = minimumDate.getFullYear();
		const endYear = maximumDate.getFullYear();
		return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
	};

	const days = generateDays(selectedMonth, selectedYear);
	const years = generateYears();

	useEffect(() => {
		if (visible && value) {
			setSelectedDay(value.getDate());
			setSelectedMonth(value.getMonth());
			setSelectedYear(value.getFullYear());
		}
	}, [visible, value]);

	const handleDayChange = (day: number) => {
		setSelectedDay(day);
		updateDate(day, selectedMonth, selectedYear);
	};

	const handleMonthChange = (month: number) => {
		setSelectedMonth(month);
		const newDays = generateDays(month, selectedYear);
		const newDay = Math.min(selectedDay, newDays.length);
		setSelectedDay(newDay);
		updateDate(newDay, month, selectedYear);
	};

	const handleYearChange = (year: number) => {
		setSelectedYear(year);
		const newDays = generateDays(selectedMonth, year);
		const newDay = Math.min(selectedDay, newDays.length);
		setSelectedDay(newDay);
		updateDate(newDay, selectedMonth, year);
	};

	const updateDate = (day: number, month: number, year: number) => {
		const newDate = new Date(year, month, day);
		if (newDate >= minimumDate && newDate <= maximumDate) {
			onChange(newDate);
		}
	};

	const handleClose = () => {
		// Apply the current selection when closing
		const finalDate = new Date(selectedYear, selectedMonth, selectedDay);
		if (finalDate >= minimumDate && finalDate <= maximumDate) {
			onChange(finalDate);
		}
		onClose();
	};

	return (
		<BottomSheet
			visible={visible}
			onClose={handleClose}
			height={350}
		>
			<View style={styles.container}>
				<View style={styles.wheelsContainer}>
					<View style={styles.wheelContainer}>
						<Text style={styles.wheelLabel}>Dia</Text>
						<Picker
							selectedValue={selectedDay}
							onValueChange={handleDayChange}
							style={styles.picker}
							itemStyle={styles.pickerItem}
						>
							{days.map((day) => (
								<Picker.Item key={day} label={day.toString()} value={day} />
							))}
						</Picker>
					</View>

					<View style={styles.wheelContainer}>
						<Text style={styles.wheelLabel}>Mês</Text>
						<Picker
							selectedValue={selectedMonth}
							onValueChange={handleMonthChange}
							style={styles.picker}
							itemStyle={styles.pickerItem}
						>
							{months.map((month, index) => (
								<Picker.Item key={index} label={month} value={index} />
							))}
						</Picker>
					</View>

					<View style={styles.wheelContainer}>
						<Text style={styles.wheelLabel}>Ano</Text>
						<Picker
							selectedValue={selectedYear}
							onValueChange={handleYearChange}
							style={styles.picker}
							itemStyle={styles.pickerItem}
						>
							{years.map((year) => (
								<Picker.Item key={year} label={year.toString()} value={year} />
							))}
						</Picker>
					</View>
				</View>
			</View>
		</BottomSheet>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	wheelsContainer: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'space-around',
	},
	wheelContainer: {
		flex: 1,
		alignItems: 'center',
	},
	wheelLabel: {
		fontSize: 14,
		fontWeight: '500',
		color: Colors.icon.gray,
		marginBottom: 16,
	},
	picker: {
		width: 100,
		height: 250,
	},
	pickerItem: {
		fontSize: 16,
		color: Colors.light.text,
		fontWeight: '400',
	},
}); 