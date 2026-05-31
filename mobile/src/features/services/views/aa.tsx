import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/shared/theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ChevronLeft } from 'lucide-react-native';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import { groupsApi } from '@/features/groups/api';
import { storageService } from '@/shared/lib/storage';
import { styles } from '@/features/services/styles/aa.styles';

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

export default function AaMeetings() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const [searchQuery, setSearchQuery] = useState('');
	type GroupFilter = 'all' | 'online' | 'in-person' | 'feminine';
	const [selectedFilter, setSelectedFilter] = useState<GroupFilter>('all');
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

			const groups = require('@/data/groups.json');
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
			const groups = await groupsApi.getUserGroups(token);
			setUserGroups(groups.map((g) => String(g.id)));
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

			await groupsApi.addAAGroup(token, { groupId, notificationsEnabled: false });

			setUserGroups(prev => [...prev, groupId]);
			Alert.alert('Sucesso', 'Adicionado aos seus grupos');

			router.push('/(tabs)/groups');
		} catch (error: unknown) {
			console.error('Erro ao adicionar grupo:', error);
			const message = error instanceof Error ? error.message : 'Não foi possível adicionar o grupo';
			Alert.alert('Erro', message);
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
							source={require('@/assets/images/aa.png')}
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
							onPress={() => setSelectedFilter(filter.key as GroupFilter)}
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
									{alreadyAdded ? (
										<TouchableOpacity
											style={styles.addedButton}
											disabled={true}
										>
											<MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
										</TouchableOpacity>
									) : (
										<TouchableOpacity
											style={styles.addButton}
											onPress={() => handleAddGroup(group.id)}
											disabled={addingGroupId === group.id}
										>
											<MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
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
