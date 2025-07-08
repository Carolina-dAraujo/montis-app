import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	Alert,
	Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/mobile/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { apiService } from '@/mobile/services/api';
import { storageService } from '@/mobile/services/storage';
import { ChevronLeft } from 'lucide-react-native';
import { AAGroup, UserGroup } from '@/mobile/hooks/useUserGroups';

const weekDays = [
	{ key: 'monday', label: 'Segunda' },
	{ key: 'tuesday', label: 'Terça' },
	{ key: 'wednesday', label: 'Quarta' },
	{ key: 'thursday', label: 'Quinta' },
	{ key: 'friday', label: 'Sexta' },
	{ key: 'saturday', label: 'Sábado' },
	{ key: 'sunday', label: 'Domingo' },
];

export default function GroupDetailScreen() {
	const { id } = useLocalSearchParams();
	const router = useRouter();
	const [group, setGroup] = useState<AAGroup | null>(null);
	const [loading, setLoading] = useState(true);
	const { groups } = require('@/mobile/data/groups.json');

	useEffect(() => {
		loadGroupDetails();
	}, [id]);

	const loadGroupDetails = async () => {
		try {
			setLoading(true);

			const foundGroup = groups.find((g: AAGroup) => g.id === id);

			if (foundGroup) {
				setGroup(foundGroup);
			} else {
				Alert.alert('Erro', 'Grupo não encontrado');
				router.back();
			}
		} catch (error) {
			Alert.alert('Erro', 'Não foi possível carregar os detalhes do grupo');
			router.back();
		} finally {
			setLoading(false);
		}
	};

	const handleNotificationToggle = async (enabled: boolean) => {
		if (!group) return;

		try {
			const token = await storageService.getAuthToken();
			if (!token) {
				console.error('No auth token available');
				return;
			}

			await apiService.updateGroupNotifications(token, group.id, enabled);
			setGroup(prev => prev ? { ...prev, notificationsEnabled: enabled } : null);
		} catch (error) {
			console.error('Error updating notification preferences:', error);
			Alert.alert('Erro', 'Não foi possível atualizar as preferências de notificação');
		}
	};

	const handleScheduleToggle = async (day: string, enabled: boolean) => {
		if (!group) return;

		try {
			const token = await storageService.getAuthToken();
			if (!token) {
				console.error('No auth token available');
				return;
			}

			// setGroup(prev => prev ? { ...prev, schedule: { ...prev.schedule, [day]: enabled ? ...prev.schedule[day] : [] } } : null);
		} catch (error) {
			console.error('Error updating meeting schedules:', error);
			Alert.alert('Erro', 'Não foi possível atualizar os horários de reunião');
		}
	};

	const handleCall = () => {
		if (group?.link) {
			Linking.openURL(group.link);
		}
	};

	const handleShare = () => {
		if (group) {
			const shareText = `${group.name}\n\nEndereço: ${group.address.street}, ${group.address.number || 'S/N'}\nTelefone: ${group.link}\nHorário: ${group.schedule}`;
			// You can implement sharing functionality here
			Alert.alert('Compartilhar', shareText);
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case 'virtual':
				return 'monitor';
			case 'in-person':
				return 'account-group';
			default:
				return 'help-circle';
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case 'virtual':
				return Colors.light.tint;
			case 'in-person':
				return Colors.containers.blueLight;
			default:
				return Colors.icon.gray;
		}
	};

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.loadingContainer}>
					<MaterialCommunityIcons
						name="account-group"
						size={48}
						color={Colors.containers.blue}
					/>
					<Text style={styles.loadingText}>Carregando detalhes...</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (!group) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.errorContainer}>
					<MaterialCommunityIcons
						name="alert-circle"
						size={48}
						color={Colors.icon.gray}
					/>
					<Text style={styles.errorText}>Grupo não encontrado</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
					<ChevronLeft size={24} color={Colors.icon.gray} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>{group.name}</Text>
				<View style={styles.headerSpacer} />
				<TouchableOpacity
					style={styles.notificationButton}
					onPress={() => handleNotificationToggle(!group.notificationsEnabled)}
				>
					<MaterialCommunityIcons
						name={group.notificationsEnabled ? 'bell' : 'bell-outline'}
						size={20}
						color={group.notificationsEnabled ? Colors.containers.blue : Colors.icon.gray}
					/>
				</TouchableOpacity>
			</View>

			<ScrollView showsVerticalScrollIndicator={false}>


				<View style={styles.infoSection}>
					<View style={styles.infoCard}>
						<View style={styles.infoHeader}>
							<MaterialCommunityIcons name="map-marker" size={18} color={Colors.containers.blue} />
							<Text style={styles.infoTitle}>Localização</Text>
						</View>
						{group.address.street && (
							<Text style={styles.infoContent}>{group.address.street}, {group.address.number || 'S/N'}</Text>
						)}
						{group.address.city && (
							<Text style={styles.infoContent}>{group.address.city} - {group.address.state}</Text>
						)}
						{/* <View style={styles.infoMeta}>
							<MaterialCommunityIcons name="map-marker-distance" size={14} color={Colors.icon.gray} />
							<Text style={styles.infoMetaText}>{group.address.neighborhood}</Text>
						</View> */}
					</View>

					{group.link && (
					<TouchableOpacity style={[styles.infoCard, styles.phoneCard]} onPress={handleCall}>
						<View style={styles.infoCardContent}>
							<View style={styles.infoHeader}>
								<MaterialCommunityIcons name="link" size={18} color={Colors.containers.blue} />
								<Text style={styles.infoTitle}>Link de reunião</Text>
							</View>
							<Text style={styles.infoContent}>{group.link}</Text>
						</View>
						</TouchableOpacity>
					)}
				</View>

				<View style={styles.schedulesSection}>
					<Text style={styles.sectionTitle}>Horários Semanais</Text>
					<View style={styles.schedulesList}>
						{weekDays.map((day) => {
							const schedule = group.schedule[day.key];
							const isEnabled = schedule?.length > 0;

							if (!schedule) return null;

							return (
								<View key={day.key} style={styles.scheduleItem}>
									<View style={styles.scheduleInfo}>
										<View style={styles.scheduleHeader}>
											<MaterialCommunityIcons
												name="calendar-week"
												size={16}
												color={Colors.containers.blue}
											/>
											<Text style={styles.scheduleDay}>{day.label}</Text>
										</View>
										<Text style={[styles.scheduleTime, {
											color: isEnabled ? Colors.light.text : Colors.icon.gray
										}]}>
											{schedule?.map(s => `${s.start} - ${s.end}`).join(', ') || 'Não agendado'}
										</Text>
									</View>
									<TouchableOpacity
										style={[styles.scheduleToggle, {
											backgroundColor: isEnabled ? Colors.containers.blue : '#F8F9FA',
											borderColor: isEnabled ? Colors.containers.blue : '#E9ECEF'
										}]}
										onPress={() => handleScheduleToggle(day.key, !isEnabled)}
									>
										<MaterialCommunityIcons
											name={isEnabled ? 'bell' : 'bell-off'}
											size={16}
											color={isEnabled ? '#FFFFFF' : Colors.icon.gray}
										/>
									</TouchableOpacity>
								</View>
							);
						})}
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
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingTop: 16,
	},
	backButton: {
		paddingRight: 8,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.light.text,
	},
	headerSpacer: {
		flex: 1,
	},
	notificationButton: {
		padding: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	shareButton: {
		padding: 8,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		fontSize: 16,
		color: Colors.icon.gray,
		marginTop: 16,
		fontWeight: '500',
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorText: {
		fontSize: 16,
		color: Colors.icon.gray,
		marginTop: 16,
	},
	overviewSection: {
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	overviewCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: 20,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	overviewHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	overviewInfo: {
		flex: 1,
		marginLeft: 12,
	},
	overviewTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.light.text,
		marginBottom: 4,
	},
	overviewSubtitle: {
		fontSize: 14,
		color: Colors.icon.gray,
		fontWeight: '500',
	},
	overviewStats: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	statItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	statText: {
		fontSize: 12,
		color: Colors.icon.gray,
		fontWeight: '500',
	},
	quickActions: {
		flexDirection: 'row',
		paddingHorizontal: 20,
		paddingTop: 16,
		gap: 12,
	},
	actionButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.containers.blue,
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 12,
		gap: 8,
	},
	actionText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	infoSection: {
		paddingHorizontal: 20,
		paddingTop: 24,
		gap: 12,
	},
	infoCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: '#E9ECEF',
	},
	infoCardContent: {
		flex: 1,
	},
	phoneCard: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	infoHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
		gap: 8,
	},
	infoTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: Colors.light.text,
	},
	infoContent: {
		fontSize: 14,
		color: Colors.light.text,
		lineHeight: 20,
	},
	infoMeta: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		marginTop: 8,
	},
	infoMetaText: {
		fontSize: 12,
		color: Colors.icon.gray,
		fontWeight: '500',
	},
	schedulesSection: {
		paddingHorizontal: 20,
		paddingTop: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.light.text,
		marginBottom: 16,
	},
	schedulesList: {
		gap: 8,
	},
	scheduleItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#E9ECEF',
	},
	scheduleInfo: {
		flex: 1,
	},
	scheduleHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginBottom: 4,
	},
	scheduleDay: {
		fontSize: 14,
		fontWeight: '500',
		color: Colors.light.text,
	},
	scheduleTime: {
		fontSize: 12,
		color: Colors.icon.gray,
		marginTop: 2,
	},
	scheduleToggle: {
		width: 24,
		height: 24,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
