import { View, Text, TouchableOpacity, Alert, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/shared/theme/colors';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { styles } from '@/features/crisis/styles/crise.styles';

export default function Crise() {
	const [isAlertActive, setIsAlertActive] = useState(false);

	const handleEmergencyAlert = () => {
		Alert.alert(
			"Alerta de Emergência",
			"Tem certeza que deseja enviar um alerta para seus contatos de emergência?",
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Enviar",
					style: "destructive",
					onPress: () => {
						setIsAlertActive(true);
						// TODO: Implement actual emergency alert
						setTimeout(() => setIsAlertActive(false), 3000);
					}
				}
			]
		);
	};

	const handleCallEmergency = (number: string, service: string) => {
		Alert.alert(
			`Ligar para ${service}`,
			`Deseja ligar para ${service} (${number})?`,
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Ligar",
					onPress: () => Linking.openURL(`tel:${number}`)
				}
			]
		);
	};

	const handleManageContacts = () => {
		router.push('/(config)/emergency-contacts');
	};

	const handleCopingTools = () => {
		router.push('/(config)/coping-tools');
	};

	const handleCrisisLog = () => {
		router.push('/(config)/crisis-log');
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<Text style={styles.title}>Crise</Text>
					<Text style={styles.subtitle}>Acesso rápido a recursos de emergência</Text>
				</View>

				<View style={styles.emergencyCard}>
					<TouchableOpacity
						style={[styles.emergencyButton, isAlertActive && styles.emergencyButtonActive]}
						onPress={handleEmergencyAlert}
						disabled={isAlertActive}
					>
						<Ionicons
							name="warning"
							size={24}
							color="white"
						/>
						<Text style={styles.emergencyButtonText}>
							{isAlertActive ? "Alerta Enviado" : "Enviar alerta de emergência"}
						</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.card}>
					<Text style={styles.cardTitle}>Serviços de emergência</Text>
					<View style={styles.servicesContainer}>
						<TouchableOpacity
							style={styles.serviceCard}
							onPress={() => handleCallEmergency('190', 'Polícia')}
						>
							<Ionicons name="shield" size={20} color={Colors.containers.blue} />
							<Text style={styles.serviceText}>Polícia</Text>
							<Text style={styles.serviceNumber}>190</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.serviceCard}
							onPress={() => handleCallEmergency('192', 'Ambulância')}
						>
							<Ionicons name="medical" size={20} color={Colors.containers.blue} />
							<Text style={styles.serviceText}>Ambulância</Text>
							<Text style={styles.serviceNumber}>192</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.serviceCard}
							onPress={() => handleCallEmergency('193', 'Bombeiros')}
						>
							<Ionicons name="flame" size={20} color={Colors.containers.blue} />
							<Text style={styles.serviceText}>Bombeiros</Text>
							<Text style={styles.serviceNumber}>193</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.serviceCard}
							onPress={() => handleCallEmergency('188', 'CVV')}
						>
							<Ionicons name="heart" size={20} color={Colors.containers.blue} />
							<Text style={styles.serviceText}>CVV</Text>
							<Text style={styles.serviceNumber}>188</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.card}>
					<Text style={styles.cardTitle}>Ações rápidas</Text>

					<TouchableOpacity style={styles.actionCard} onPress={handleCopingTools}>
						<Ionicons name="leaf" size={20} color={Colors.light.text} />
						<Text style={styles.actionText}>Ferramentas de coping</Text>
						<Ionicons name="chevron-forward" size={16} color={Colors.light.icon} />
					</TouchableOpacity>

					<TouchableOpacity style={styles.actionCard} onPress={handleManageContacts}>
						<Ionicons name="people" size={20} color={Colors.light.text} />
						<Text style={styles.actionText}>Contatos de emergência</Text>
						<Ionicons name="chevron-forward" size={16} color={Colors.light.icon} />
					</TouchableOpacity>

					{/* <TouchableOpacity style={styles.actionCard} onPress={handleCrisisLog}>
						<Ionicons name="document-text" size={20} color={Colors.light.text} />
						<Text style={styles.actionText}>Registro de crise</Text>
						<Ionicons name="chevron-forward" size={16} color={Colors.light.icon} />
					</TouchableOpacity> */}
				</View>



				<View>
					<View style={styles.card}>
						<Text style={styles.cardTitle}>Informações importantes</Text>

						<View style={styles.infoCard}>
							<Ionicons name="information-circle" size={20} color={Colors.containers.blue} />
							<Text style={styles.infoText}>
								Se você está em perigo imediato, ligue para 190 (Polícia) ou 192 (Ambulância).
							</Text>
						</View>

						<View style={styles.infoCard}>
							<Ionicons name="heart" size={20} color={Colors.containers.blue} />
							<Text style={styles.infoText}>
								Você não está sozinho. Há pessoas que se importam e querem ajudar.
							</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};
