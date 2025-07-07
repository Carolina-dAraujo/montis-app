import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView, TextInput, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/mobile/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ChevronLeft } from 'lucide-react-native';
import { apiService } from '@/mobile/services/api';
import { storageService } from '@/mobile/services/storage';

interface AAService {
	id: string;
	name: string;
	address: string;
	phone: string;
	schedule: string;
	type: 'online' | 'in-person' | 'hybrid';
	distance: string;
}

const aaServices: AAService[] = [
	{
		id: '1',
		name: 'Grupo AA Liberdade',
		address: 'Rua das Flores, 123 - Centro',
		phone: '(11) 9999-8888',
		schedule: 'Segunda, Quarta, Sexta - 19:00',
		type: 'in-person',
		distance: '0.5 km',
	},
	{
		id: '2',
		name: 'Grupo AA Esperança',
		address: 'Av. Paulista, 456 - Bela Vista',
		phone: '(11) 8888-7777',
		schedule: 'Terça, Quinta, Sábado - 20:00',
		type: 'hybrid',
		distance: '1.2 km',
	},
	{
		id: '3',
		name: 'Grupo AA Nova Vida',
		address: 'Rua Augusta, 789 - Consolação',
		phone: '(11) 7777-6666',
		schedule: 'Domingo - 18:00',
		type: 'online',
		distance: '2.1 km',
	},
];

export default function AAServicesScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedFilter, setSelectedFilter] = useState<'all' | 'online' | 'in-person' | 'hybrid'>('all');
	const [userGroups, setUserGroups] = useState<Array<{ groupId: string }>>([]);
	const [loadingGroups, setLoadingGroups] = useState(true);

	React.useEffect(() => {
		loadUserGroups();
	}, []);

	const loadUserGroups = async () => {
		try {
			const token = await storageService.getAuthToken();
			if (!token) {
				console.error('No auth token available');
				return;
			}

			const groups = await apiService.getUserGroups(token);
			setUserGroups(groups.map(group => ({ groupId: group.groupId })));
		} catch (error) {
			console.error('Error loading user groups:', error);
		} finally {
			setLoadingGroups(false);
		}
	};

	const filteredServices = aaServices.filter(service => {
		const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			service.address.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter = selectedFilter === 'all' || service.type === selectedFilter;
		return matchesSearch && matchesFilter;
	});

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
				return '#007AFF';
			case 'in-person':
				return '#34C759';
			case 'hybrid':
				return '#FF9500';
			default:
				return Colors.icon.gray;
		}
	};

	const getTypeText = (type: string) => {
		switch (type) {
			case 'online':
				return 'Online';
			case 'in-person':
				return 'Presencial';
			case 'hybrid':
				return 'Híbrido';
			default:
				return 'Desconhecido';
		}
	};

	const isGroupAdded = (serviceId: string) => {
		return userGroups.some(group => group.groupId === serviceId);
	};

	const handleAddToGroup = async (service: AAService) => {
		try {
			const token = await storageService.getAuthToken();
			if (!token) {
				console.error('No auth token available');
				return;
			}

			const groupData = {
				groupId: service.id,
				notificationsEnabled: true,
			};

			const result = await apiService.addAAGroup(token, groupData);
			console.log('Group added successfully:', result);

			setUserGroups(prev => [...prev, { groupId: service.id }]);

			Alert.alert(
				'Grupo Adicionado!',
				`"${service.name}" foi adicionado aos seus grupos com sucesso.`,
				[
					{
						text: 'Ver Meus Grupos',
						onPress: () => router.push('/grupos'),
						style: 'default',
					},
					{
						text: 'Continuar',
						style: 'cancel',
					},
				]
			);
		} catch (error) {
			console.error('Error adding group:', error);
			Alert.alert(
				'Erro',
				'Não foi possível adicionar o grupo. Tente novamente.',
				[{ text: 'OK' }]
			);
		}
	};

	const parseScheduleToMeetingSchedules = (schedule: string): Array<{ day: string; time: string; enabled: boolean }> => {
		const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
		const schedules: Array<{ day: string; time: string; enabled: boolean }> = [];

		if (schedule.toLowerCase().includes('segunda') || schedule.toLowerCase().includes('monday')) {
			schedules.push({ day: 'monday', time: '19:00', enabled: true });
		}
		if (schedule.toLowerCase().includes('terça') || schedule.toLowerCase().includes('tuesday')) {
			schedules.push({ day: 'tuesday', time: '19:00', enabled: true });
		}
		if (schedule.toLowerCase().includes('quarta') || schedule.toLowerCase().includes('wednesday')) {
			schedules.push({ day: 'wednesday', time: '19:00', enabled: true });
		}
		if (schedule.toLowerCase().includes('quinta') || schedule.toLowerCase().includes('thursday')) {
			schedules.push({ day: 'thursday', time: '19:00', enabled: true });
		}
		if (schedule.toLowerCase().includes('sexta') || schedule.toLowerCase().includes('friday')) {
			schedules.push({ day: 'friday', time: '19:00', enabled: true });
		}
		if (schedule.toLowerCase().includes('sábado') || schedule.toLowerCase().includes('saturday')) {
			schedules.push({ day: 'saturday', time: '19:00', enabled: true });
		}
		if (schedule.toLowerCase().includes('domingo') || schedule.toLowerCase().includes('sunday')) {
			schedules.push({ day: 'sunday', time: '19:00', enabled: true });
		}

		if (schedules.length === 0) {
			schedules.push({ day: 'monday', time: '19:00', enabled: true });
		}

		return schedules;
	};

	return (
		<SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
					<ChevronLeft size={24} color={Colors.icon.gray} />
				</TouchableOpacity>
					<View style={styles.titleContainer}>
						<Image
							source={require('@/mobile/assets/images/aa.png')}
							style={styles.serviceIcon}
							resizeMode="contain"
						/>
						<Text style={styles.title}>Alcoólicos Anônimos (AA)</Text>
					</View>
					<View style={{ width: 24 }} />
				</View>
			</View>

			<View style={styles.searchContainer}>
				<View style={styles.searchBox}>
					<MaterialCommunityIcons name="magnify" size={20} color={Colors.icon.gray} />
					<TextInput
						style={styles.searchInput}
						placeholder="Buscar grupos..."
						placeholderTextColor={Colors.icon.gray}
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>
			</View>

			<View style={styles.filters}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{[
						{ key: 'all', label: 'Todos' },
						{ key: 'in-person', label: 'Presencial' },
						{ key: 'online', label: 'Online' },
						{ key: 'hybrid', label: 'Híbrido' },
					].map((filter) => (
						<TouchableOpacity
							key={filter.key}
							style={[
								styles.filterButton,
								selectedFilter === filter.key && styles.filterButtonActive,
							]}
							onPress={() => setSelectedFilter(filter.key as any)}
						>
							<Text
								style={[
									styles.filterText,
									selectedFilter === filter.key && styles.filterTextActive,
								]}
							>
								{filter.label}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{filteredServices.map((service) => (
					<TouchableOpacity key={service.id} style={styles.serviceCard}>
						<View style={styles.serviceHeader}>
							<Text style={styles.serviceName}>{service.name}</Text>
							<View style={styles.headerActions}>
								<View style={[styles.typeBadge, { backgroundColor: getTypeColor(service.type) }]}>
									<MaterialCommunityIcons
										name={getTypeIcon(service.type) as any}
										size={12}
										color="#FFFFFF"
									/>
									<Text style={styles.typeText}>{getTypeText(service.type)}</Text>
								</View>
								{isGroupAdded(service.id) ? (
									<View style={styles.addedIcon}>
										<MaterialCommunityIcons name="check-circle" size={24} color={Colors.containers.blue} />
									</View>
								) : (
									<TouchableOpacity
										style={styles.addIcon}
										onPress={() => handleAddToGroup(service)}
										disabled={loadingGroups}
									>
										<MaterialCommunityIcons 
											name="plus-circle" 
											size={24} 
											color={loadingGroups ? Colors.icon.gray : Colors.containers.blue} 
										/>
									</TouchableOpacity>
								)}
							</View>
						</View>

						<View>
							<View style={styles.infoRow}>
								<MaterialCommunityIcons name="map-marker" size={16} color={Colors.icon.gray} />
								<Text style={styles.infoText}>{service.address}</Text>
							</View>

							<View style={styles.infoRow}>
								<MaterialCommunityIcons name="phone" size={16} color={Colors.icon.gray} />
								<Text style={styles.infoText}>{service.phone}</Text>
							</View>

							<View style={styles.infoRow}>
								<MaterialCommunityIcons name="clock" size={16} color={Colors.icon.gray} />
								<Text style={styles.infoText}>{service.schedule}</Text>
							</View>

							{service.distance && (
								<View style={styles.infoRow}>
									<MaterialCommunityIcons name="map-marker-distance" size={16} color={Colors.icon.gray} />
									<Text style={styles.infoText}>{service.distance}</Text>
								</View>
							)}
						</View>


					</TouchableOpacity>
				))}
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
		paddingBottom: 16,
		paddingHorizontal: 20,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	backButton: {
		paddingRight: 8,
		paddingVertical: 8,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: Colors.light.text,
	},
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	serviceIcon: {
		width: 24,
		height: 24,
		marginRight: 8,
	},
	searchContainer: {
		paddingHorizontal: 20,
		paddingBottom: 16,
	},
	searchBox: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderWidth: 1,
		borderColor: Colors.input,
	},
	searchInput: {
		flex: 1,
		marginLeft: 8,
		fontSize: 16,
		color: Colors.light.text,
	},
	filters: {
		paddingHorizontal: 20,
		paddingBottom: 16,
	},
	filterButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		backgroundColor: Colors.lightGray,
		marginRight: 8,
	},
	filterButtonActive: {
		backgroundColor: Colors.containers.blue,
	},
	filterText: {
		fontSize: 14,
		color: Colors.icon.gray,
	},
	filterTextActive: {
		color: '#FFFFFF',
		fontWeight: 'bold',
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	serviceCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	serviceHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	headerActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	addIcon: {
		padding: 4,
	},
	addedIcon: {
		padding: 4,
	},
	serviceName: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.light.text,
		flex: 1,
	},
	typeBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	typeText: {
		fontSize: 12,
		color: '#FFFFFF',
		fontWeight: 'bold',
		marginLeft: 4,
	},
	infoRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	infoText: {
		fontSize: 14,
		color: Colors.light.text,
		marginLeft: 8,
	},

});
