import { View, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';

interface ChevronLeftProps {
	size?: number;
	color?: string;
	thickness?: number;
	onPress?: () => void;
}

export function ChevronLeft({
	size = 40,
	color = Colors.icon.gray,
	thickness = 1.2,
	onPress,
}: ChevronLeftProps) {
	const lineLength = size * 0.6;

	return (
		<Pressable style={[styles.container, { width: size, height: size }]} onPress={onPress}>
			<View
				style={[
					styles.line,
					{
						backgroundColor: color,
						height: thickness,
						width: lineLength - 11,
						transform: [
							{ rotate: '125deg' },
							{ translateX: -lineLength / 4 },
						],
					},
				]}
			/>
			<View
				style={[
					styles.line,
					{
						backgroundColor: color,
						height: thickness,
						width: lineLength - 11,
						transform: [
							{ rotate: '-125deg' },
							{ translateX: -lineLength / 4 },
						],
					},
				]}
			/>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	line: {
		position: 'absolute',
		borderRadius: 1,
	},
});
