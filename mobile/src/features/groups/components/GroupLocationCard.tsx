import { View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '@/shared/theme/colors';
import { AAGroup } from '@/features/groups/hooks/useUserGroups';
import { styles } from '@/features/groups/styles/groupDetail.styles';

type GroupLocationCardProps = {
	group: AAGroup;
	onCall: () => void;
	onCopyAddress: () => void;
	onOpenInMaps: () => void;
	onOpenInGoogleMaps: () => void;
	onOpenInWaze: () => void;
};

export function GroupLocationCard({
	group,
	onCall,
	onCopyAddress,
	onOpenInMaps,
	onOpenInGoogleMaps,
	onOpenInWaze,
}: GroupLocationCardProps) {
	return (
		<View style={styles.infoSection}>
			<View style={styles.infoCard}>
				<View style={styles.infoHeader}>
					<MaterialCommunityIcons name="map-marker" size={18} color={Colors.containers.blue} />
					<Text style={styles.infoTitle}>Localização</Text>
				</View>
				{group.address.street ? (
					<Text style={styles.infoContent}>
						{group.address.street}, {group.address.number || 'S/N'}
					</Text>
				) : null}
				{group.address.city ? (
					<Text style={styles.infoContent}>
						{group.address.city} - {group.address.state}
					</Text>
				) : null}

				{group.type === 'in-person' ? (
					<View style={styles.locationActions}>
						<TouchableOpacity style={styles.locationActionButton} onPress={onCopyAddress}>
							<MaterialCommunityIcons name="content-copy" size={16} color={Colors.icon.gray} />
							<Text style={styles.locationActionText}>Copiar</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.locationActionButton} onPress={onOpenInMaps}>
							<MaterialCommunityIcons name="map" size={16} color={Colors.icon.gray} />
							<Text style={styles.locationActionText}>Maps</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.locationActionButton} onPress={onOpenInGoogleMaps}>
							<MaterialCommunityIcons name="google-maps" size={16} color={Colors.icon.gray} />
							<Text style={styles.locationActionText}>Google</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.locationActionButton} onPress={onOpenInWaze}>
							<MaterialCommunityIcons name="car" size={16} color={Colors.icon.gray} />
							<Text style={styles.locationActionText}>Waze</Text>
						</TouchableOpacity>
					</View>
				) : null}
			</View>

			{group.link ? (
				<TouchableOpacity style={[styles.infoCard, styles.phoneCard]} onPress={onCall}>
					<View style={styles.infoCardContent}>
						<View style={styles.infoHeader}>
							<MaterialCommunityIcons name="link" size={18} color={Colors.containers.blue} />
							<Text style={styles.infoTitle}>Link de reunião</Text>
						</View>
						<Text style={styles.infoContent}>{group.link}</Text>
					</View>
				</TouchableOpacity>
			) : null}
		</View>
	);
}
