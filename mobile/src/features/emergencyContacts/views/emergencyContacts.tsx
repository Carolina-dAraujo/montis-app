import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEmergencyContactsList } from '@/features/emergencyContacts/hooks/useEmergencyContactsList';
import { ConfigHeader } from '@/features/settings/components/ConfigHeader';
import { EmergencyContactsListBody } from '@/features/emergencyContacts/components/EmergencyContactsListBody';
import { EmergencyContactsInfoSection } from '@/features/emergencyContacts/components/EmergencyContactsInfoSection';
import { styles } from '@/features/emergencyContacts/styles/emergencyContacts.styles';

export default function EmergencyContacts() {
	const router = useRouter();
	const {
		contacts,
		loading,
		handleToggleContact,
		handleAddContact,
		handleShowContactOptions,
	} = useEmergencyContactsList();

	return (
		<SafeAreaView style={styles.container}>
			<ConfigHeader title="Contatos de emergência" onBack={() => router.back()} />
			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Seus contatos</Text>
					<Text style={styles.sectionSubtitle}>
						Estes contatos receberão alertas quando você enviar um sinal de emergência.
					</Text>
				</View>

				<EmergencyContactsListBody
					contacts={contacts}
					loading={loading}
					onAddContact={handleAddContact}
					onToggleContact={handleToggleContact}
					onShowContactOptions={handleShowContactOptions}
				/>

				<EmergencyContactsInfoSection />
			</ScrollView>
		</SafeAreaView>
	);
}
