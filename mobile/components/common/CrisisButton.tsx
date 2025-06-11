import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Colors } from '@/mobile/constants/Colors';

type CrisisButtonProps = {
	onPress: () => void;
};

export function CrisisButton({ onPress }: CrisisButtonProps) {
	return (
		<View style={styles.container}>
			<Pressable
				style={styles.button}
				onPress={onPress}
			>
				<View style={styles.iconContainer}>
					<FontAwesome6
						name="triangle-exclamation"
						size={24}
						color="#FFD700"
					/>
				</View>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		bottom: 80,
		right: 24,
		zIndex: 1000,
	},
	button: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: Colors.containers.blue,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: Colors.light.background,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.3,
		shadowRadius: 2,
		elevation: 4,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.3)',
	},
	iconContainer: {
		width: 32,
		height: 32,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
