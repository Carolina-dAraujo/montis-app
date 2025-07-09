import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView, TextInput, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/mobile/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ChevronLeft } from 'lucide-react-native';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import { apiService } from 'services/api';
import { storageService } from '@/mobile/services/storage';
// import { apiService } from '@/mobile/services/api';

interface AAGroup {
	id: string;
	name: string;
	address: {
		city: string;
		state: string;
		neighborhood?: string;
		street?: string;
		number?: string | null;
		cep?: string;
		place?: string;
	};
	schedule: {
		[key: string]: { start: string; end: string }[];
	};
	type: 'virtual' | 'in-person';
	platform?: string;
	link?: string;
	isFeminine?: boolean;
	description?: string;
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

export default function AAGroupsScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedFilter, setSelectedFilter] = useState<'all' | 'online' | 'in-person' | 'feminine'>('all');
	const [aaGroups, setAAGroups] = useState<{ groups: AAGroup[] }>({ groups: [] });
	const [loadingAAGroups, setLoadingAAGroups] = useState(true);
	const [userGroups, setUserGroups] = useState<string[]>([]);
	const [addingGroupId, setAddingGroupId] = useState<string | null>(null);

	useEffect(() => {
		loadAAGroups();
		loadUserGroups();
	}, []);

	const loadAAGroups = async () => {
		setLoadingAAGroups(true);

		try {
			// const groups = await apiService.getAllAAGroups();

			const groups = require('@/mobile/data/groups.json');
			if (groups && Array.isArray(groups.groups)) {
				const sortedGroups = [...groups.groups].sort((a, b) =>
					a.name.localeCompare(b.name, 'pt-BR')
				);

				setAAGroups({ groups: sortedGroups as AAGroup[] });
			} else {
				setAAGroups({ groups: [] });
			}
		} catch (e) {
			setAAGroups({ groups: [] });
		} finally {
			setLoadingAAGroups(false);
		}
	};

	const loadUserGroups = async () => {
		try {
			const token = await storageService.getAuthToken();
			if (!token) return;
			const groups = await apiService.getUserGroups(token);
			setUserGroups(groups.map((g: any) => String(g.groupId ?? g.id ?? g.group_id)));
		} catch (error) {
			console.error('Error loading user groups:', error);
			setUserGroups([]);
		}
	};

	const handleAddGroup = async (groupId: string) => {
		try {
			setAddingGroupId(groupId);
			const token = await storageService.getAuthToken();
			if (!token) throw new Error('Usuário não autenticado');

			await apiService.addAAGroup(token, { groupId, notificationsEnabled: false });

			setUserGroups(prev => [...prev, groupId]);
			Alert.alert('Sucesso', 'Adicionado aos seus grupos');

			router.push('/grupos');
		} catch (error: any) {
			console.error('Erro ao adicionar grupo:', error);
			Alert.alert('Erro', error.message || 'Não foi possível adicionar o grupo');
		} finally {
			setAddingGroupId(null);
		}
	};

	const filteredGroups = aaGroups.groups.filter(group => {
		const matchesSearch = (group.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
			(group.address.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
			(group.address.neighborhood || '').toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter =
			selectedFilter === 'all' ||
			(selectedFilter === 'online' && group.type === 'virtual') ||
			(selectedFilter === 'in-person' && group.type === 'in-person') ||
			(selectedFilter === 'feminine' && group.isFeminine === true);
		return matchesSearch && matchesFilter;
	});

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
						{ key: 'feminine', label: 'Feminino' },
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
				{filteredGroups.map((group) => {
					const alreadyAdded = userGroups.includes(String(group.id));
						return (
						<View key={group.id} style={styles.serviceCard}>
							<View style={styles.serviceHeader}>
								<Text style={styles.serviceName}>{group.name}</Text>
								<View style={styles.headerActions}>
									{!alreadyAdded && (
										<TouchableOpacity
											style={{ padding: 6, borderRadius: 16, backgroundColor: Colors.containers.blue }}
											onPress={() => handleAddGroup(group.id)}
											disabled={addingGroupId === group.id}
										>
											<MaterialCommunityIcons name="plus" size={18} color="#fff" />
										</TouchableOpacity>
									)}
								</View>
							</View>
							<View>
								{group.address.street && group.address.number && (
									<View style={styles.infoRow}>
										<FontAwesome name="map-pin" style={{ marginLeft: 3, marginRight: 3 }} size={16} color={Colors.icon.gray} />
										<Text style={styles.infoText}>{group.address.street}, {group.address.number || 'S/N'}</Text>
									</View>
								)}
								{group.address.place && (
									<View style={styles.infoRow}>
										<MaterialCommunityIcons name="map-marker" size={16} color={Colors.icon.gray} />
										<Text style={styles.infoText}>{group.address.place}</Text>
									</View>
								)}

								{(group.address.neighborhood || group.address.state || group.address.city) && (
									<View style={styles.infoRow}>
										<MaterialCommunityIcons name="city" size={16} color={Colors.icon.gray} />
										<Text style={{ ...styles.infoText, marginLeft: 8 }}>{group.address.neighborhood ? group.address.neighborhood + ' - ' : ''}{group.address.city} - {group.address.state}</Text>
									</View>
								)}
								{weekDays.map(day => {
									const meeting = group.schedule[day.key as keyof AAGroup['schedule']] as null | { start: string; end: string }[];
									if (!meeting) return null;
									return (
										<View key={day.key} style={styles.infoRow}>
											<MaterialCommunityIcons name="calendar" size={16} color={Colors.icon.gray} />
											<Text style={styles.infoText}>{day.label}: {meeting.map(m => `${m.start} às ${m.end}`).join(', ')}</Text>
										</View>
									);
								})}
							</View>
							<View style={styles.badgesRow}>
								{group.type && (
									<View style={[styles.typeBadge, { backgroundColor: group.type === 'virtual' ? '#007AFF' : '#34C759' }]}>
										<MaterialCommunityIcons
											name={group.type === 'virtual' ? 'monitor' : 'account-group'}
											size={12}
											color="#FFFFFF"
										/>
										<Text style={styles.typeText}>{group.type === 'virtual' ? 'Online' : 'Presencial'}</Text>
									</View>
								)}
								{group.isFeminine && (
									<View style={styles.feminineBadge}>
										<MaterialCommunityIcons name="gender-female" size={14} color="#fff" />
										<Text style={styles.badgeText}>Feminino</Text>
									</View>
								)}
							</View>
						</View>
						);
				})}
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
		borderRadius: 8,
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
		flexShrink: 1,
		flexWrap: 'nowrap',
	},
	loadingContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 40,
	},
	loadingText: {
		marginTop: 12,
		fontSize: 16,
		color: Colors.light.text,
	},
	badgesRow: {
		flexDirection: 'row',
		marginTop: 12,
		gap: 8,
	},
	feminineBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#E75480',
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	badgeText: {
		color: '#fff',
		fontSize: 12,
		marginLeft: 4,
		fontWeight: 'bold',
	},
});
