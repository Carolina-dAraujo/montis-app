import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/mobile/constants/Colors';
import { ChevronLeft } from '@/mobile/components/icons/ChevronLeft';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { usePreferences } from '@/mobile/hooks/usePreferences';

export default function PermissionsScreen() {
	const router = useRouter();
	const { permissions, updatePermissions, isLoading } = usePreferences();
	const [notificationPermission, setNotificationPermission] = useState<boolean | null>(null);
	const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

	React.useEffect(() => {
		checkNotificationPermission();
		checkLocationPermission();
	}, []);

	const checkNotificationPermission = async () => {
		try {
			const { status } = await Notifications.getPermissionsAsync();
			setNotificationPermission(status === 'granted');
		} catch (error) {
			console.error('Error checking notification permission:', error);
		}
	};

	const checkLocationPermission = async () => {
		try {
			const { status } = await Location.getForegroundPermissionsAsync();
			setLocationPermission(status === 'granted');
		} catch (error) {
			console.error('Error checking location permission:', error);
		}
	};

	const handleNotificationToggle = async (value: boolean) => {
		if (value) {
			try {
				const { status } = await Notifications.requestPermissionsAsync();
				const granted = status === 'granted';
				setNotificationPermission(granted);

				if (granted) {
					Alert.alert(
						'Permissão Concedida',
						'Você receberá notificações importantes sobre seu progresso e suporte.',
						[{ text: 'OK' }]
					);
				} else {
					Alert.alert(
						'Permissão Negada',
						'Você pode ativar as notificações nas configurações do dispositivo.',
						[{ text: 'OK' }]
					);
				}

				updatePermissions({
					notifications: granted,
					location: locationPermission ?? false,
				});
			} catch (error) {
				Alert.alert('Erro', 'Não foi possível solicitar permissão para notificações.');
			}
		} else {
			Alert.alert(
				'Desativar Notificações',
				'Para desativar as notificações, vá nas configurações do dispositivo.',
				[{ text: 'OK' }]
			);
			updatePermissions({
				notifications: false,
				location: locationPermission ?? false,
			});
		}
	};

	const handleLocationToggle = async (value: boolean) => {
		if (value) {
			try {
				const { status } = await Location.requestForegroundPermissionsAsync();
				const granted = status === 'granted';
				setLocationPermission(granted);

				if (granted) {
					Alert.alert(
						'Permissão Concedida',
						'Localização será usada para encontrar recursos de suporte próximos.',
						[{ text: 'OK' }]
					);
				} else {
					Alert.alert(
						'Permissão Negada',
						'Você pode ativar a localização nas configurações do dispositivo.',
						[{ text: 'OK' }]
					);
				}

				updatePermissions({
					notifications: notificationPermission ?? false,
					location: granted,
				});
			} catch (error) {
				Alert.alert('Erro', 'Não foi possível solicitar permissão para localização.');
			}
		} else {
			Alert.alert(
				'Desativar Localização',
				'Para desativar a localização, vá nas configurações do dispositivo.',
				[{ text: 'OK' }]
			);
			updatePermissions({
				notifications: notificationPermission ?? false,
				location: false,
			});
		}
	};

	const getPermissionStatus = (permission: boolean | null) => {
		if (permission === null) return 'Verificando...';
		return permission ? '✓ Ativa' : '✗ Inativa';
	};

	const getPermissionColor = (permission: boolean | null) => {
		if (permission === null) return Colors.icon.gray;
		return permission ? '#4CAF50' : '#F44336';
	};

	const getStatusBackground = (permission: boolean | null) => {
		if (permission === null) return Colors.lightGray;
		return permission ? '#E8F5E8' : '#FFEBEE';
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<View style={styles.backIconContainer}>
						<ChevronLeft onPress={() => router.back()} />
					</View>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Permissões</Text>
					</View>
				</View>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.section}>
					<Text style={styles.sectionDescription}>
						Essas permissões são necessárias para o funcionamento completo do app.
					</Text>
				</View>

				<View style={styles.section}>
					<View style={styles.permissionCard}>
						<View style={styles.permissionContent}>
							<View style={styles.permissionInfo}>
								<View style={styles.iconContainer}>
									<MaterialCommunityIcons
										name="bell-outline"
										size={24}
										color={Colors.containers.blue}
									/>
								</View>
								<View style={styles.textContainer}>
									<View style={styles.titleRow}>
										<Text style={styles.permissionTitle}>Notificações</Text>
										<View style={[
											styles.permissionStatus,
											{ backgroundColor: getStatusBackground(notificationPermission) }
										]}>
											<Text style={[styles.statusText, { color: getPermissionColor(notificationPermission) }]}>
												{getPermissionStatus(notificationPermission)}
											</Text>
										</View>
									</View>
									<Text style={styles.permissionDescription}>
										Receba lembretes, alertas de crise e atualizações importantes
									</Text>
								</View>
							</View>
						</View>
						<Pressable
							style={[
								styles.actionButton,
								notificationPermission ? styles.actionButtonActive : styles.actionButtonInactive
							]}
							onPress={() => handleNotificationToggle(!notificationPermission)}
							disabled={notificationPermission === null}
						>
							<Text style={[
								styles.actionButtonText,
								notificationPermission && styles.actionButtonTextActive
							]}>
								{notificationPermission ? 'Gerenciar' : 'Ativar'}
							</Text>
						</Pressable>
					</View>
				</View>

				<View style={styles.section}>
					<View style={styles.permissionCard}>
						<View style={styles.permissionContent}>
							<View style={styles.permissionInfo}>
								<View style={styles.iconContainer}>
									<MaterialCommunityIcons
										name="map-marker-outline"
										size={24}
										color={Colors.containers.blue}
									/>
								</View>
								<View style={styles.textContainer}>
									<View style={styles.titleRow}>
										<Text style={styles.permissionTitle}>Localização</Text>
										<View style={[
											styles.permissionStatus,
											{ backgroundColor: getStatusBackground(locationPermission) }
										]}>
											<Text style={[styles.statusText, { color: getPermissionColor(locationPermission) }]}>
												{getPermissionStatus(locationPermission)}
											</Text>
										</View>
									</View>
									<Text style={styles.permissionDescription}>
										Encontre recursos de suporte e grupos próximos à sua localização. A localização será compartilhada com responsáveis quando necessário.
									</Text>
								</View>
							</View>
						</View>
						<Pressable
							style={[
								styles.actionButton,
								locationPermission ? styles.actionButtonActive : styles.actionButtonInactive
							]}
							onPress={() => handleLocationToggle(!locationPermission)}
							disabled={locationPermission === null}
						>
							<Text style={[
								styles.actionButtonText,
								locationPermission && styles.actionButtonTextActive
							]}>
								{locationPermission ? 'Gerenciar' : 'Ativar'}
							</Text>
						</Pressable>
					</View>
				</View>

				<View style={styles.infoSection}>
					<View style={styles.infoContainer}>
						<MaterialCommunityIcons
							name="information-outline"
							size={20}
							color={Colors.icon.gray}
						/>
						<Text style={styles.infoText}>
							Você pode alterar essas permissões a qualquer momento nas configurações do seu dispositivo.
						</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	header: {
		paddingBottom: 8,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	backIconContainer: {
		paddingTop: 8,
	},
	titleContainer: {
		paddingTop: 8,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: Colors.light.text,
	},
	section: {
		marginBottom: 24,
	},
	sectionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.light.text,
	},
	sectionDescription: {
		fontSize: 14,
		color: Colors.icon.gray,
		lineHeight: 20,
		marginBottom: 16,
	},
	permissionCard: {
		backgroundColor: Colors.light.background,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.input,
		overflow: 'hidden',
	},
	permissionContent: {
		padding: 20,
	},
	permissionInfo: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: Colors.lightGray,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	textContainer: {
		flex: 1,
	},
	permissionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 4,
	},
	permissionDescription: {
		fontSize: 14,
		color: Colors.icon.gray,
		lineHeight: 20,
		marginBottom: 4,
	},
	permissionStatus: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	statusText: {
		fontSize: 11,
		fontWeight: '600',
	},
	actionButton: {
		paddingVertical: 16,
		paddingHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'center',
		borderTopWidth: 1,
		borderTopColor: Colors.input,
	},
	actionButtonActive: {
		backgroundColor: Colors.lightGray,
	},
	actionButtonInactive: {
		backgroundColor: Colors.containers.blue,
	},
	actionButtonText: {
		fontSize: 14,
		fontWeight: '500',
		color: Colors.light.text,
	},
	actionButtonTextActive: {
		fontWeight: 'bold',
	},
	infoSection: {
		marginTop: 16,
	},
	infoContainer: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		padding: 16,
		backgroundColor: Colors.lightGray,
		borderRadius: 12,
	},
	infoText: {
		fontSize: 14,
		color: Colors.icon.gray,
		lineHeight: 20,
		marginLeft: 8,
		flex: 1,
	},
	titleRow: {
		flexDirection: 'row',
		alignItems: 'baseline',
		gap: 8,
	},
});
