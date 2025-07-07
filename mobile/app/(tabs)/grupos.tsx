import { useState, useEffect, useRef } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	Alert,
	Animated,
} from 'react-native';
import { Colors } from '@/mobile/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { apiService } from '@/mobile/services/api';
import { storageService } from '@/mobile/services/storage';
import { useAuth } from '@/mobile/contexts/AuthContext';
import { useRouter } from 'expo-router';

interface MeetingSchedule {
	day: string;
	time: string;
	enabled: boolean;
}

interface UserGroup {
	groupId: string;
	groupName: string;
	type: string;
	address: string;
	phone: string;
	schedule: string;
	distance: string;
	meetingSchedules: MeetingSchedule[];
	notificationsEnabled: boolean;
	addedAt: string;
}

const weekDays = [
	{ key: 'monday', label: 'Segunda' },
	{ key: 'tuesday', label: 'Terça' },
	{ key: 'wednesday', label: 'Quarta' },
	{ key: 'thursday', label: 'Quinta' },
	{ key: 'friday', label: 'Sexta' },
	{ key: 'saturday', label: 'Sábado' },
	{ key: 'sunday', label: 'Domingo' },
];

export default function GruposScreen() {
	const auth = useAuth();
	const user = auth?.user;
	const router = useRouter();
	const [groups, setGroups] = useState<UserGroup[]>([]);
	const [loading, setLoading] = useState(true);

	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.8)).current;
	const dot1Anim = useRef(new Animated.Value(0.3)).current;
	const dot2Anim = useRef(new Animated.Value(0.6)).current;
	const dot3Anim = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		loadUserGroups();
	}, []);

	useEffect(() => {
		if (loading) {
			Animated.parallel([
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 800,
					useNativeDriver: true,
				}),
				Animated.timing(scaleAnim, {
					toValue: 1,
					duration: 600,
					useNativeDriver: true,
				}),
			]).start();

			const animateDots = () => {
				Animated.sequence([
					Animated.parallel([
						Animated.timing(dot1Anim, {
							toValue: 1,
							duration: 400,
							useNativeDriver: true,
						}),
						Animated.timing(dot2Anim, {
							toValue: 0.3,
							duration: 400,
							useNativeDriver: true,
						}),
						Animated.timing(dot3Anim, {
							toValue: 0.6,
							duration: 400,
							useNativeDriver: true,
						}),
					]),
					Animated.parallel([
						Animated.timing(dot1Anim, {
							toValue: 0.6,
							duration: 400,
							useNativeDriver: true,
						}),
						Animated.timing(dot2Anim, {
							toValue: 1,
							duration: 400,
							useNativeDriver: true,
						}),
						Animated.timing(dot3Anim, {
							toValue: 0.3,
							duration: 400,
							useNativeDriver: true,
						}),
					]),
					Animated.parallel([
						Animated.timing(dot1Anim, {
							toValue: 0.3,
							duration: 400,
							useNativeDriver: true,
						}),
						Animated.timing(dot2Anim, {
							toValue: 0.6,
							duration: 400,
							useNativeDriver: true,
						}),
						Animated.timing(dot3Anim, {
							toValue: 1,
							duration: 400,
							useNativeDriver: true,
						}),
					]),
				]).start(() => animateDots());
			};

			animateDots();
		}
	}, [loading]);

	// Mocked groups data
	const mockedGroups: UserGroup[] = [
		{
			groupId: 'aa-group-1',
			groupName: 'Grupo AA Esperança',
			type: 'in-person',
			address: 'Rua das Flores, 123 - Centro, São Paulo',
			phone: '(11) 99999-9999',
			schedule: 'Segunda, Quarta e Sexta às 19h',
			distance: '2.3 km',
			meetingSchedules: [
				{ day: 'monday', time: '19:00', enabled: true },
				{ day: 'wednesday', time: '19:00', enabled: true },
				{ day: 'friday', time: '19:00', enabled: true },
			],
			notificationsEnabled: true,
			addedAt: new Date().toISOString(),
		},
		{
			groupId: 'aa-group-2',
			groupName: 'Grupo AA Nova Vida',
			type: 'online',
			address: 'Reunião Online - Zoom',
			phone: '(11) 88888-8888',
			schedule: 'Terça e Quinta às 20h',
			distance: 'Online',
			meetingSchedules: [
				{ day: 'tuesday', time: '20:00', enabled: true },
				{ day: 'thursday', time: '20:00', enabled: false },
			],
			notificationsEnabled: false,
			addedAt: new Date().toISOString(),
		},
		{
			groupId: 'aa-group-3',
			groupName: 'Grupo AA Liberdade',
			type: 'hybrid',
			address: 'Av. Paulista, 1000 - Bela Vista, São Paulo',
			phone: '(11) 77777-7777',
			schedule: 'Domingo às 10h',
			distance: '5.1 km',
			meetingSchedules: [
				{ day: 'sunday', time: '10:00', enabled: true },
			],
			notificationsEnabled: true,
			addedAt: new Date().toISOString(),
		},
	];

	const loadUserGroups = async () => {
		try {
			setLoading(true);
			const token = await storageService.getAuthToken();
			if (!token) {
				console.error('No auth token available');
				setGroups(mockedGroups);
				return;
			}

			const userGroups = await apiService.getUserGroups(token);
			console.log('API returned groups:', userGroups);

			setGroups(mockedGroups);

			// if (!userGroups || userGroups.length === 0) {
			// 	console.log('No groups from API, using mocked data');
			// 	setGroups(mockedGroups);
			// } else {
			// 	console.log('Using groups from API');
			// 	setGroups(userGroups);
			// }
		} catch (error) {
			console.error('Error loading user groups:', error);
			// On error, use mocked data
			console.log('Error occurred, using mocked data');
			setGroups(mockedGroups);
		} finally {
			setLoading(false);
		}
	};



	// Early return if auth is still loading
	if (auth.isLoading) {
		return (
			<SafeAreaView style={[styles.container, { paddingTop: 50 }]}>
				<View style={styles.header}>
					<Text style={styles.title}>Meus grupos</Text>
					<Text style={styles.subtitle}>
						Gerencie seus grupos e preferências de notificações
					</Text>
				</View>
				<View style={styles.emptyState}>
					<MaterialCommunityIcons
						name="account-group-outline"
						size={48}
						color={Colors.icon.gray}
					/>
					<Text style={styles.emptyTitle}>Carregando...</Text>
					<Text style={styles.emptySubtitle}>
						Aguarde um momento
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	const handleNotificationToggle = async (groupId: string, enabled: boolean) => {
		try {
			const token = await storageService.getAuthToken();
			if (!token) {
				console.error('No auth token available');
				return;
			}

			await apiService.updateGroupNotifications(token, groupId, enabled);

			setGroups(prevGroups =>
				prevGroups.map(group =>
					group.groupId === groupId
						? { ...group, notificationsEnabled: enabled }
						: group
				)
			);
		} catch (error) {
			console.error('Error updating notifications:', error);
			Alert.alert('Erro', 'Não foi possível atualizar as notificações');
		}
	};

	const handleScheduleToggle = async (groupId: string, day: string, enabled: boolean) => {
		try {
			const token = await storageService.getAuthToken();
			if (!token) {
				console.error('No auth token available');
				return;
			}

			const group = groups.find(g => g.groupId === groupId);
			if (!group) return;

			const updatedSchedules = group.meetingSchedules.map(schedule =>
				schedule.day === day ? { ...schedule, enabled } : schedule
			);

			await apiService.updateMeetingSchedules(token, groupId, updatedSchedules);

			setGroups(prevGroups =>
				prevGroups.map(g =>
					g.groupId === groupId
						? { ...g, meetingSchedules: updatedSchedules }
						: g
				)
			);
		} catch (error) {
			console.error('Error updating schedules:', error);
			Alert.alert('Erro', 'Não foi possível atualizar os horários');
		}
	};

	const handleAddGroup = () => {
		router.push('/services');
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case 'online':
				return 'monitor';
			case 'in-person':
				return 'account-group';
			case 'hybrid':
				return 'monitor-account';
			default:
				return 'help-circle';
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case 'online':
				return Colors.light.tint;
			case 'in-person':
				return Colors.containers.blueLight;
			case 'hybrid':
				return Colors.light.tint;
			default:
				return Colors.icon.gray;
		}
	};

	if (loading) {
		return (
			<SafeAreaView style={[styles.container, { paddingTop: 50 }]}>
				<Animated.View
					style={[
						styles.loadingContainer,
						{
							opacity: fadeAnim,
							transform: [{ scale: scaleAnim }],
						}
					]}
				>
					<View style={styles.loadingAnimation}>
						<MaterialCommunityIcons
							name="account-group"
							size={40}
							color={Colors.containers.blue}
						/>
						<View style={styles.loadingDots}>
							<Animated.View
								style={[
									styles.dot,
									{
										opacity: dot1Anim,
										transform: [{ scale: dot1Anim }],
									}
								]}
							/>
							<Animated.View
								style={[
									styles.dot,
									{
										opacity: dot2Anim,
										transform: [{ scale: dot2Anim }],
									}
								]}
							/>
							<Animated.View
								style={[
									styles.dot,
									{
										opacity: dot3Anim,
										transform: [{ scale: dot3Anim }],
									}
								]}
							/>
						</View>
					</View>
					<Text style={styles.loadingText}>Carregando seus grupos...</Text>
				</Animated.View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={[styles.container, { paddingTop: 50 }]}>
			<View style={styles.header}>
				<Text style={styles.title}>Meus grupos</Text>
				<Text style={styles.subtitle}>
					Gerencie seus grupos e preferências de notificações
				</Text>
			</View>

			{groups.length === 0 ? (
				<View style={styles.emptyState}>
					<MaterialCommunityIcons
						name="account-group-outline"
						size={48}
						color={Colors.icon.gray}
					/>
					<Text style={styles.emptyTitle}>Nenhum grupo adicionado</Text>
					<Text style={styles.emptySubtitle}>
						Adicione grupos para começar
					</Text>
					<TouchableOpacity style={styles.addButton} onPress={handleAddGroup}>
						<MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
						<Text style={styles.addButtonText}>Adicionar grupo</Text>
					</TouchableOpacity>
				</View>
			) : (
				<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
					{groups.map((group) => (
						<TouchableOpacity
							key={group.groupId}
							style={styles.groupCard}
							onPress={() => router.push(`/group-detail/${group.groupId}` as any)}
							activeOpacity={0.8}
						>
							<View style={styles.cardContent}>
								<View style={styles.mainInfo}>
									<View style={styles.groupHeader}>
										<Text style={styles.groupName}>{group.groupName}</Text>
										<View style={styles.distanceInfo}>
											<MaterialCommunityIcons name="map-marker-distance" size={12} color={Colors.icon.gray} />
											<Text style={styles.distanceText}>{group.distance}</Text>
										</View>
									</View>
									<Text style={styles.groupAddress}>{group.address}</Text>
								</View>

								<View style={styles.cardActions}>
									<View style={[styles.typeBadge, { backgroundColor: getTypeColor(group.type) }]}>
										<MaterialCommunityIcons
											name={getTypeIcon(group.type) as any}
											size={12}
											color="#FFFFFF"
										/>
										<Text style={styles.typeText}>
											{group.type === 'online' ? 'Online' :
												group.type === 'in-person' ? 'Presencial' : 'Híbrido'}
										</Text>
									</View>

									<TouchableOpacity
										style={styles.notificationButton}
										onPress={(e) => {
											e.stopPropagation();
											handleNotificationToggle(group.groupId, !group.notificationsEnabled);
										}}
									>
										<MaterialCommunityIcons
											name={group.notificationsEnabled ? 'bell' : 'bell-outline'}
											size={20}
											color={group.notificationsEnabled ? Colors.containers.blue : Colors.icon.gray}
										/>
									</TouchableOpacity>
								</View>
							</View>
						</TouchableOpacity>
					))}
				</ScrollView>
			)}

			{groups.length > 0 && (
				<TouchableOpacity style={styles.fab} onPress={handleAddGroup}>
					<MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
				</TouchableOpacity>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	header: {
		padding: 20,
		paddingBottom: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: Colors.light.text,
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: Colors.icon.gray,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 16,
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
	loadingAnimation: {
		alignItems: 'center',
		marginBottom: 8,
	},
	loadingDots: {
		flexDirection: 'row',
		marginTop: 16,
		gap: 8,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: Colors.containers.blue,
	},
	emptyState: {
		height: '70%',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: Colors.light.text,
		marginTop: 20,
		marginBottom: 8,
	},
	emptySubtitle: {
		fontSize: 14,
		color: Colors.icon.gray,
		textAlign: 'center',
		marginBottom: 32,
	},
	addButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.containers.blue,
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 20,
		gap: 6,
	},
	addButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	fab: {
		position: 'absolute',
		bottom: 20,
		right: 20,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: Colors.containers.blue,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: Colors.light.shadow,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	groupCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 4,
		borderWidth: 0,
	},
	cardContent: {
		padding: 20,
	},
	mainInfo: {
		flex: 1,
		marginBottom: 12,
	},
	groupName: {
		fontSize: 18,
		fontWeight: '700',
		color: Colors.light.text,
		marginBottom: 8,
	},
	groupHeader: {
		marginBottom: 8,
	},
	groupMeta: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	distanceInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	distanceText: {
		fontSize: 12,
		color: Colors.icon.gray,
		fontWeight: '500',
	},
	groupAddress: {
		fontSize: 14,
		color: Colors.icon.gray,
		lineHeight: 20,
	},
	cardActions: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	headerActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	notificationButton: {
		padding: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	typeBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		alignSelf: 'flex-start',
	},
	typeText: {
		fontSize: 12,
		color: '#FFFFFF',
		fontWeight: 'bold',
		marginLeft: 4,
	},
	notificationToggle: {
		alignItems: 'center',
	},
	toggleLabel: {
		fontSize: 12,
		color: Colors.icon.gray,
		marginBottom: 4,
	},
	groupDetails: {
		marginBottom: 16,
	},
	detailRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	detailText: {
		fontSize: 14,
		color: Colors.light.text,
		marginLeft: 8,
	},
	schedulesSection: {
		borderTopWidth: 1,
		borderTopColor: Colors.input,
		paddingTop: 16,
	},
	schedulesTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: Colors.light.text,
		marginBottom: 12,
	},
	schedulesList: {
		gap: 8,
	},
	scheduleItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 12,
		backgroundColor: Colors.lightGray,
		borderRadius: 8,
	},
	scheduleInfo: {
		flex: 1,
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

});
