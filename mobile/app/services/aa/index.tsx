import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView, TextInput, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/mobile/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ChevronLeft } from 'lucide-react-native';
import { apiService } from '@/mobile/services/api';

interface AAGroup {
	id: string;
	name: string;
	address: string;
	city: string;
	neighborhood: string;
	online: boolean;
	monday: null | { start: string; end: string };
	tuesday: null | { start: string; end: string };
	wednesday: null | { start: string; end: string };
	thursday: null | { start: string; end: string };
	friday: null | { start: string; end: string };
	saturday: null | { start: string; end: string };
	sunday: null | { start: string; end: string };
	phone?: string;
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
	const [selectedFilter, setSelectedFilter] = useState<'all' | 'online' | 'in-person'>('all');
	const [aaGroups, setAAGroups] = useState<AAGroup[]>([]);
	const [loadingAAGroups, setLoadingAAGroups] = useState(true);

	useEffect(() => {
		loadAAGroups();
	}, []);

	const loadAAGroups = async () => {
		setLoadingAAGroups(true);
		try {
			const groups = await apiService.getAllAAGroups();
			setAAGroups(groups);
		} catch (error) {
			setAAGroups([]);
		} finally {
			setLoadingAAGroups(false);
		}
	};

	const filteredGroups = aaGroups.filter(group => {
		const matchesSearch = (group.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
			(group.address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
			(group.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
			(group.neighborhood || '').toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter =
			selectedFilter === 'all' ||
			(selectedFilter === 'online' && group.online) ||
			(selectedFilter === 'in-person' && !group.online);
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
				{loadingAAGroups ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color={Colors.containers.blue} />
						<Text style={styles.loadingText}>Carregando grupos de apoio...</Text>
					</View>
				) : filteredGroups.map((group) => (
					<View key={group.id} style={styles.serviceCard}>
						<View style={styles.serviceHeader}>
							<Text style={styles.serviceName}>{group.name}</Text>
							<View style={styles.headerActions}>
								<View style={[styles.typeBadge, { backgroundColor: group.online ? '#007AFF' : '#34C759' }]}>
									<MaterialCommunityIcons
										name={group.online ? 'monitor' : 'account-group'}
										size={12}
										color="#FFFFFF"
									/>
									<Text style={styles.typeText}>{group.online ? 'Online' : 'Presencial'}</Text>
								</View>
							</View>
						</View>
						<View>
							<View style={styles.infoRow}>
								<MaterialCommunityIcons name="map-marker" size={16} color={Colors.icon.gray} />
								<Text style={styles.infoText}>{group.address.split('#')[0]}</Text>
							</View>
							<View style={styles.infoRow}>
								<MaterialCommunityIcons name="city" size={16} color={Colors.icon.gray} />
								<Text style={styles.infoText}>{group.city} - {group.neighborhood}</Text>
							</View>
							{group.phone && group.phone.trim() !== '' && (
								<View style={styles.infoRow}>
									<MaterialCommunityIcons name="phone" size={16} color={Colors.icon.gray} />
									<Text style={styles.infoText}>{group.phone}</Text>
								</View>
							)}
							{weekDays.map(day => {
								const meeting = group[day.key as keyof AAGroup] as null | { start: string; end: string };
								if (!meeting) return null;
								return (
									<View key={day.key} style={styles.infoRow}>
										<MaterialCommunityIcons name="calendar" size={16} color={Colors.icon.gray} />
										<Text style={styles.infoText}>{day.label}: {meeting.start} às {meeting.end}</Text>
									</View>
								);
							})}
						</View>
					</View>
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
});
