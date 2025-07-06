import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface LoadingScreenProps {
	message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
	message = "Carregando..."
}) => {
	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color={Colors.containers.blue} />
			<Text style={styles.message}>{message}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.light.background,
	},
	message: {
		marginTop: 16,
		fontSize: 16,
		color: Colors.light.text,
		textAlign: 'center',
	},
});
