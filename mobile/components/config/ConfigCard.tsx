import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface ConfigCardProps {
	icon: string;
	title: string;
	onPress: () => void;
}

export function ConfigCard({ icon, title, onPress }: ConfigCardProps) {
	return (
		<Pressable style={styles.container} onPress={onPress}>
			<View>
				<FontAwesome6 solid name={icon} size={40} color={Colors.light.background} />
			</View>
			<View style={styles.contentContainer}>
				<Text style={styles.title}>{title}</Text>
				<View style={styles.separator} />
				<View style={styles.accessContainer}>
					<Text style={styles.accessText}>Acessar {title.toLowerCase()}</Text>
					<FontAwesome6 solid name="chevron-right" size={8} color={Colors.light.background} />
				</View>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.containers.blue,
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		flexDirection: 'column',
		alignItems: 'flex-start',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
		gap: 36,
	},
	contentContainer: {
		flex: 1,
		width: '100%',
	},
	title: {
		fontSize: 16,
		fontWeight: '300',
		color: Colors.light.background,
		marginBottom: 8,
	},
	separator: {
		height: 1,
		backgroundColor: Colors.light.background,
		marginBottom: 8,
		opacity: 0.5,
		width: '100%',
	},
	accessContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: 8,
	},
	accessText: {
		fontSize: 12,
		fontWeight: '600',
		color: Colors.light.background,
	},
});