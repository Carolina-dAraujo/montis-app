import { useEffect, useRef } from 'react';
import { 
	View,
	Text,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	Alert,
	Animated,
 } from 'react-native';
import { Colors } from '@/shared/theme/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// import { storageService } from '@/shared/lib/storage';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { useRouter } from 'expo-router';
import { useUserGroups } from '@/features/groups/hooks/useUserGroups';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	getFloatingActionBottom,
	getTabBarScrollPadding,
} from '@/shared/components/ui/tabBarMetrics';
import { styles } from '@/features/groups/styles/grupos.styles';
import type { MaterialCommunityIconName } from '@/shared/types/icons';

export default function Grupos() {
	const auth = useAuth();
	const router = useRouter();
	const {
		groups,
		loading,
	} = useUserGroups();

	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.8)).current;
	const dot1Anim = useRef(new Animated.Value(0.3)).current;
	const dot2Anim = useRef(new Animated.Value(0.6)).current;
	const dot3Anim = useRef(new Animated.Value(1)).current;
	const insets = useSafeAreaInsets();

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

	const handleAddGroup = () => {
		router.push('/services');
	};

	const getTypeIcon = (type: string): MaterialCommunityIconName => {
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

	if (auth.isLoading || loading) {
		return (
			<SafeAreaView style={[styles.container, { paddingTop: 50 }]}>
				<View style={styles.header}>
					<Text style={styles.title}>Meus grupos</Text>
					<Text style={styles.subtitle}>
						Gerencie seus grupos e preferências de notificações
					</Text>
				</View>
				<View style={styles.loadingContainer}>
					<Animated.View style={styles.loadingAnimation}>
						<MaterialCommunityIcons
							name="account-group"
							size={48}
							color={Colors.containers.blue}
						/>
					</Animated.View>
					<Text style={styles.loadingText}>Carregando...</Text>
					<View style={styles.loadingDots}>
						<Animated.View style={[styles.dot, { opacity: dot1Anim }]} />
						<Animated.View style={[styles.dot, { opacity: dot2Anim }]} />
						<Animated.View style={[styles.dot, { opacity: dot3Anim }]} />
					</View>
				</View>
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
						Adicione grupos para começar a receber notificações
					</Text>
					<TouchableOpacity style={styles.addButton} onPress={() => router.push('/services')}>
						<MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
						<Text style={styles.addButtonText}>Adicionar grupo</Text>
					</TouchableOpacity>
				</View>
			) : (
				<ScrollView
					style={styles.content}
					contentContainerStyle={{
						paddingBottom: getTabBarScrollPadding(insets.bottom, 72),
					}}
					showsVerticalScrollIndicator={false}
				>
					{groups.map((group) => (
						<TouchableOpacity
							key={group.id}
							style={styles.groupCard}
							onPress={() => router.push({
								pathname: '/group-detail/[id]',
								params: { id: group.id }
							})}
							activeOpacity={0.8}
						>
							<View style={styles.cardContent}>
								<View style={styles.mainInfo}>
									<Text style={styles.groupName}>{group.name}</Text>
									<View style={[styles.typeBadge, { backgroundColor: getTypeColor(group.type) }]}>
										<MaterialCommunityIcons
											name={getTypeIcon(group.type)}
											size={12}
											color="#FFFFFF"
										/>
										<Text style={styles.typeText}>
											{group.type === 'virtual' ? 'Online' : 'Presencial'}
										</Text>
									</View>
								</View>

								<MaterialCommunityIcons
									name="chevron-right"
									size={20}
									color={Colors.icon.gray}
								/>
							</View>
						</TouchableOpacity>
					))}
				</ScrollView>
			)}

			{groups.length > 0 && (
				<TouchableOpacity
					style={[styles.fab, { bottom: getFloatingActionBottom(insets.bottom) }]}
					onPress={handleAddGroup}
					activeOpacity={0.85}
				>
					<MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
				</TouchableOpacity>
			)}
		</SafeAreaView>
	);
}
