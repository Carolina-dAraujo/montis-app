import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/mobile/constants/Colors';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ChevronLeft, Plus, Phone, User, Heart } from 'lucide-react-native';
import { useEmergencyContacts } from '@/mobile/hooks/useEmergencyContacts';
import { EmergencyContact } from '@/mobile/services/EmergencyContactsService';

const EmergencyContactsScreen = () => {
	const { contacts, loading, error, deleteContact, toggleContact } = useEmergencyContacts();

	const handleDeleteContact = async (id: string) => {
		Alert.alert(
			'Remover contato',
			'Tem certeza que deseja remover este contato de emergência?',
			[
				{ text: 'Cancelar', style: 'cancel' },
				{
					text: 'Remover',
					style: 'destructive',
					onPress: async () => {
						try {
							await deleteContact(id);
						} catch (error) {
							Alert.alert('Erro', 'Não foi possível remover o contato. Tente novamente.');
						}
					}
				}
			]
		);
	};

	const handleToggleContact = async (id: string) => {
		try {
			await toggleContact(id);
		} catch (error) {
			Alert.alert('Erro', 'Não foi possível alternar o status do contato. Tente novamente.');
		}
	};

	const handleAddContact = () => {
		router.push('/(config)/add-emergency-contact');
	};

	const renderContact = ({ item }: { item: EmergencyContact }) => (
		<View style={styles.contactCard}>
			<View style={styles.contactAvatar}>
				<Ionicons
					name="person"
					size={24}
					color={item.isActive ? Colors.containers.blue : Colors.light.icon}
				/>
			</View>

			<View style={styles.contactInfo}>
				<View style={styles.contactHeader}>
					<Text style={styles.contactName}>{item.name}</Text>
					<View style={[styles.statusBadge, item.isActive && styles.statusActive]}>
						<Text style={[styles.statusText, item.isActive && styles.statusTextActive]}>
							{item.isActive ? 'Ativo' : 'Inativo'}
						</Text>
					</View>
				</View>

				<View style={styles.contactDetails}>
					<View style={styles.detailRow}>
						<Phone size={14} color={Colors.light.icon} />
						<Text style={styles.contactPhone}>{item.phone}</Text>
					</View>
					<View style={styles.detailRow}>
						<Heart size={14} color={Colors.light.icon} />
						<Text style={styles.contactRelationship}>{item.relationship}</Text>
					</View>
				</View>
			</View>

			<View style={styles.contactActions}>
				<TouchableOpacity
					style={[styles.actionButton, styles.toggleButton]}
					onPress={() => handleToggleContact(item.id)}
				>
					<Ionicons
						name={item.isActive ? "notifications" : "notifications-off"}
						size={20}
						color={item.isActive ? Colors.containers.blue : Colors.light.icon}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.actionButton, styles.deleteButton]}
					onPress={() => handleDeleteContact(item.id)}
				>
					<Ionicons name="trash-outline" size={20} color="#FF3B30" />
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
						<ChevronLeft size={24} color={Colors.icon.gray} />
					</TouchableOpacity>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Contatos de emergência</Text>
					</View>
					<View style={{ width: 24 }} />
				</View>
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Seus contatos</Text>
					<Text style={styles.sectionSubtitle}>
						Estes contatos receberão alertas quando você enviar um sinal de emergência.
					</Text>
				</View>

				{loading ? (
					<View style={styles.loadingContainer}>
						<View style={styles.loadingIconContainer}>
							<Ionicons name="people-circle" size={48} color={Colors.containers.blue} />
						</View>
						<Text style={styles.loadingText}>Carregando contatos...</Text>
					</View>
				) : contacts.length > 0 ? (
					<>
						<FlatList
							data={contacts}
							renderItem={renderContact}
							keyExtractor={(item) => item.id}
							scrollEnabled={false}
							style={styles.contactsList}
						/>
						<View style={styles.addButtonContainer}>
							<TouchableOpacity
								style={styles.addButton}
								onPress={handleAddContact}
							>
								<Plus size={18} color={Colors.containers.blue} />
								<Text style={styles.addButtonText}>Adicionar contato</Text>
							</TouchableOpacity>
						</View>
					</>
				) : (
					<View style={styles.emptyState}>
						<View style={styles.emptyIconContainer}>
							<Ionicons name="people-circle" size={48} color={Colors.light.icon} />
						</View>
						<Text style={styles.emptyStateText}>Nenhum contato adicionado</Text>
						<Text style={styles.emptyStateSubtext}>
							Adicione contatos de emergência para receber alertas quando necessário
						</Text>
						<TouchableOpacity
							style={styles.addButtonEmpty}
							onPress={handleAddContact}
						>
							<Plus size={18} color={Colors.containers.blue} />
							<Text style={styles.addButtonText}>Adicionar contato</Text>
						</TouchableOpacity>
					</View>
				)}

				<View style={styles.infoSection}>
					<Text style={styles.infoTitle}>Informações importantes</Text>
					<View style={styles.infoCard}>
						<Ionicons name="shield-checkmark" size={20} color={Colors.containers.blue} />
						<Text style={styles.infoText}>
							Os contatos ativos receberão notificações quando você enviar um alerta de emergência.
						</Text>
					</View>
					<View style={styles.infoCard}>
						<Ionicons name="notifications" size={20} color={Colors.containers.blue} />
						<Text style={styles.infoText}>
							Você pode ativar/desativar contatos individualmente usando o botão de notificação.
						</Text>
					</View>
					<View style={styles.infoCard}>
						<Ionicons name="information-circle" size={20} color={Colors.containers.blue} />
						<Text style={styles.infoText}>
							Recomendamos adicionar pelo menos 2 contatos de confiança.
						</Text>
					</View>
					<View style={styles.infoCard}>
						<Ionicons name="trash-outline" size={20} color={Colors.containers.blue} />
						<Text style={styles.infoText}>
							Toque no ícone de lixeira para remover um contato.
						</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

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
	content: {
		flex: 1,
	},
	section: {
		padding: 20,
		paddingBottom: 10,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 8,
	},
	sectionSubtitle: {
		fontSize: 14,
		color: Colors.light.icon,
		lineHeight: 20,
	},
	contactsList: {
		paddingHorizontal: 20,
	},
	contactCard: {
		backgroundColor: 'white',
		padding: 16,
		borderRadius: 16,
		marginBottom: 12,
		flexDirection: 'row',
		alignItems: 'center',
		shadowColor: Colors.light.shadow,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	contactAvatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: Colors.lightGray,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16,
	},
	contactInfo: {
		flex: 1,
	},
	contactHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
		gap: 8,
	},
	contactName: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.light.text,
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		backgroundColor: Colors.lightGray,
	},
	statusActive: {
		backgroundColor: Colors.containers.blue + '20',
	},
	statusText: {
		fontSize: 12,
		fontWeight: '500',
		color: Colors.light.icon,
	},
	statusTextActive: {
		color: Colors.containers.blue,
	},
	contactDetails: {
		gap: 4,
	},
	detailRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	contactPhone: {
		fontSize: 14,
		color: Colors.light.text,
		marginLeft: 6,
	},
	contactRelationship: {
		fontSize: 14,
		color: Colors.light.icon,
		marginLeft: 6,
	},
	contactActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	actionButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	toggleButton: {
		backgroundColor: Colors.lightGray,
	},
	deleteButton: {
		backgroundColor: Colors.lightGray,
	},
	emptyState: {
		alignItems: 'center',
		padding: 40,
	},
	emptyIconContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: Colors.lightGray,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 16,
	},
	emptyStateText: {
		fontSize: 18,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 8,
		textAlign: 'center',
	},
	emptyStateSubtext: {
		fontSize: 14,
		color: Colors.light.icon,
		textAlign: 'center',
		lineHeight: 20,
		paddingHorizontal: 20,
	},
	loadingContainer: {
		alignItems: 'center',
		padding: 40,
	},
	loadingIconContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: Colors.lightGray,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 16,
	},
	loadingText: {
		fontSize: 16,
		color: Colors.light.text,
		textAlign: 'center',
	},
	addButtonContainer: {
		paddingHorizontal: 20,
		paddingTop: 8,
		paddingBottom: 20,
	},
	addButton: {
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: Colors.containers.blue,
		shadowColor: Colors.light.shadow,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	addButtonEmpty: {
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 12,
		borderRadius: 8,
		marginTop: 20,
		borderWidth: 1,
		borderColor: Colors.containers.blue,
		shadowColor: Colors.light.shadow,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	addButtonText: {
		color: Colors.containers.blue,
		fontSize: 14,
		fontWeight: '500',
		marginLeft: 6,
	},
	infoSection: {
		padding: 20,
		paddingTop: 10,
	},
	infoTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 12,
	},
	infoCard: {
		backgroundColor: Colors.lightGray,
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	infoText: {
		fontSize: 14,
		color: Colors.light.text,
		marginLeft: 12,
		flex: 1,
		lineHeight: 20,
	},
});

export default EmergencyContactsScreen;
