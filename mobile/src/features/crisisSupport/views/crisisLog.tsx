import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ConfigHeader } from '@/features/settings/components/ConfigHeader';
import { CrisisLogEntryCard } from '@/features/crisisSupport/components/CrisisLogEntryCard';
import { CrisisLogEntryForm } from '@/features/crisisSupport/components/CrisisLogEntryForm';
import { CrisisLogInfoSection } from '@/features/crisisSupport/components/CrisisLogInfoSection';
import { useCrisisLog } from '@/features/crisisSupport/hooks/useCrisisLog';
import { Colors } from '@/shared/theme/colors';
import { styles } from '@/features/crisisSupport/styles/crisisLog.styles';

export default function CrisisLog() {
	const {
		entries,
		isAddingEntry,
		setIsAddingEntry,
		newEntry,
		setNewEntry,
		handleAddEntry,
		handleDeleteEntry,
		cancelAddEntry,
		formatDate,
	} = useCrisisLog();

	return (
		<SafeAreaView style={styles.container}>
			<ConfigHeader title="Registro de crise" onBack={() => router.back()} />

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Seu Registro</Text>
					<Text style={styles.sectionSubtitle}>
						Acompanhe seus episódios de crise para identificar padrões
					</Text>
				</View>

				{entries.length > 0 ? (
					<FlatList
						data={entries}
						renderItem={({ item }) => (
							<CrisisLogEntryCard
								entry={item}
								formattedDate={formatDate(item.date)}
								onDelete={handleDeleteEntry}
							/>
						)}
						keyExtractor={(item) => item.id}
						scrollEnabled={false}
						style={styles.entriesList}
					/>
				) : (
					<View style={styles.emptyState}>
						<Ionicons name="document-text-outline" size={48} color={Colors.light.icon} />
						<Text style={styles.emptyStateText}>Nenhum registro encontrado</Text>
						<Text style={styles.emptyStateSubtext}>
							Adicione entradas para acompanhar seus episódios de crise
						</Text>
					</View>
				)}

				{isAddingEntry ? (
					<CrisisLogEntryForm
						entry={newEntry}
						onChange={setNewEntry}
						onSave={handleAddEntry}
						onCancel={cancelAddEntry}
					/>
				) : null}

				{!isAddingEntry ? (
					<TouchableOpacity
						style={styles.addButton}
						onPress={() => setIsAddingEntry(true)}
					>
						<Ionicons name="add" size={24} color="white" />
						<Text style={styles.addButtonText}>Adicionar Entrada</Text>
					</TouchableOpacity>
				) : null}

				<CrisisLogInfoSection />
			</ScrollView>
		</SafeAreaView>
	);
}
