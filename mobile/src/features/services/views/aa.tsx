import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors } from '@/shared/theme/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ChevronLeft } from 'lucide-react-native';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import { groupsApi } from '@/features/groups/api';
import { storageService } from '@/shared/lib/storage';
import { useNearMeLocation } from '@/features/groups/hooks/useNearMeLocation';
import { formatDistanceKm, NEAR_ME_EXPANDED_DISTANCE_KM, NEAR_ME_MAX_DISTANCE_KM } from '@/features/groups/lib/geo';
import { sortGroupsByNearMe } from '@/features/groups/lib/sortGroupsByNearMe';
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
	location?: {
		latitude: number;
		longitude: number;
	};
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

type GroupFilter = 'all' | 'near-me' | 'in-person' | 'online' | 'feminine';

const FILTER_OPTIONS: { key: GroupFilter; label: string }[] = [
	{ key: 'all', label: 'Todos' },
	{ key: 'near-me', label: 'Perto de mim' },
	{ key: 'in-person', label: 'Presencial' },
	{ key: 'online', label: 'Online' },
	{ key: 'feminine', label: 'Feminino' },
];

function matchesSearch(group: AAGroup, query: string): boolean {
	const normalized = query.toLowerCase();
	return (
		(group.name || '').toLowerCase().includes(normalized)
		|| (group.address.city || '').toLowerCase().includes(normalized)
		|| (group.address.neighborhood || '').toLowerCase().includes(normalized)
	);
}

function matchesTypeFilter(group: AAGroup, filter: Exclude<GroupFilter, 'near-me'>): boolean {
	switch (filter) {
		case 'all':
			return true;
		case 'online':
			return group.type === 'virtual';
		case 'in-person':
			return group.type === 'in-person';
		case 'feminine':
			return group.isFeminine === true;
	}
}

export default function AaMeetings() {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedFilter, setSelectedFilter] = useState<GroupFilter>('all');
	const [nearMeRadiusKm, setNearMeRadiusKm] = useState(NEAR_ME_MAX_DISTANCE_KM);
	const [aaGroups, setAAGroups] = useState<{ groups: AAGroup[] }>({ groups: [] });
	const [loadingAAGroups, setLoadingAAGroups] = useState(true);
	const [userGroups, setUserGroups] = useState<string[]>([]);
	const [addingGroupId, setAddingGroupId] = useState<string | null>(null);
	const { coords, loading: loadingLocation, error: locationError, requestLocation } = useNearMeLocation();

	useEffect(() => {
		loadAAGroups();
	}, []);

	useFocusEffect(
		useCallback(() => {
			loadUserGroups();
		}, []),
	);

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

	const filteredGroups = useMemo((): (AAGroup & { distanceKm?: number })[] => {
		const searched = aaGroups.groups.filter((group) => matchesSearch(group, searchQuery));

		if (selectedFilter === 'near-me') {
			return sortGroupsByNearMe(searched, coords, nearMeRadiusKm);
		}

		return searched
			.filter((group) => matchesTypeFilter(group, selectedFilter))
			.map((group) => ({ ...group, distanceKm: undefined }));
	}, [aaGroups.groups, searchQuery, selectedFilter, coords, nearMeRadiusKm]);

	const handleFilterSelect = async (filter: GroupFilter) => {
		setSelectedFilter(filter);
		if (filter === 'near-me') {
			setNearMeRadiusKm(NEAR_ME_MAX_DISTANCE_KM);
			await requestLocation();
		}
	};

	const isNearMe = selectedFilter === 'near-me';
	const canExpandNearMeRadius = nearMeRadiusKm < NEAR_ME_EXPANDED_DISTANCE_KM;
	const showLocationHint = isNearMe && !coords && !loadingLocation && !!locationError;
	const showEmptyNearMe =
		isNearMe
		&& !!coords
		&& !loadingLocation
		&& filteredGroups.length === 0;
	const nearMeRadiusLabel = formatDistanceKm(nearMeRadiusKm);
	const expandedRadiusLabel = formatDistanceKm(NEAR_ME_EXPANDED_DISTANCE_KM);

	return (
		<SafeAreaView style={styles.container}>
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
					{FILTER_OPTIONS.map((filter) => (
						<TouchableOpacity
							key={filter.key}
							style={[
								styles.filterButton,
								selectedFilter === filter.key && styles.filterButtonActive,
							]}
							onPress={() => handleFilterSelect(filter.key)}
						>
							{filter.key === 'near-me' && loadingLocation && selectedFilter === 'near-me' ? (
								<ActivityIndicator size="small" color="#FFFFFF" />
							) : (
								<Text
									style={[
										styles.filterText,
										selectedFilter === filter.key && styles.filterTextActive,
									]}
								>
									{filter.label}
								</Text>
							)}
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>

			{showLocationHint ? (
				<View style={styles.locationHintContainer}>
					<Text style={styles.locationHintText}>{locationError}</Text>
				</View>
			) : null}

			{isNearMe && coords && !loadingLocation ? (
				<View style={styles.locationHintContainer}>
					<Text style={styles.locationHintText}>
						Mostrando grupos presenciais a até {nearMeRadiusLabel}
					</Text>
				</View>
			) : null}

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{showEmptyNearMe ? (
					<View style={styles.emptyStateContainer}>
						<Text style={styles.emptyStateText}>
							Nenhum grupo presencial encontrado a até {nearMeRadiusLabel}.
						</Text>
						{canExpandNearMeRadius ? (
							<TouchableOpacity
								style={styles.expandSearchButton}
								onPress={() => setNearMeRadiusKm(NEAR_ME_EXPANDED_DISTANCE_KM)}
							>
								<Text style={styles.expandSearchButtonText}>
									Buscar até {expandedRadiusLabel}
								</Text>
							</TouchableOpacity>
						) : null}
					</View>
				) : null}
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
								{group.type === 'in-person' && group.distanceKm != null && (
									<View style={styles.infoRow}>
										<MaterialCommunityIcons name="map-marker-distance" size={16} color={Colors.icon.gray} />
										<Text style={styles.infoText}>{formatDistanceKm(group.distanceKm)}</Text>
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
