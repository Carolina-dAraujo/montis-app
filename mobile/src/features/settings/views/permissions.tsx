import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/shared/theme/colors';
import { useRouter } from 'expo-router';
import { ConfigHeader } from '@/features/settings/components/ConfigHeader';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { usePreferences } from '@/features/settings/hooks/usePreferences';
import { styles } from '@/features/settings/styles/permissions.styles';

export default function Permissions() {
	const router = useRouter();
	const { permissions: devicePermissions, updatePermissions, isLoading } = usePreferences();
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
			<ConfigHeader title="Permissões" onBack={() => router.back()} />

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
