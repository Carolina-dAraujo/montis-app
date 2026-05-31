import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/shared/theme/colors';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { ConfigHeader } from '@/features/settings/components/ConfigHeader';
import { styles } from '@/features/crisisSupport/styles/copingTools.styles';

export default function CopingTools() {
	const router = useRouter();
	const [activeExercise, setActiveExercise] = useState<string | null>(null);
	const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
	const [breathingCount, setBreathingCount] = useState(0);
	const breathingAnimation = useRef(new Animated.Value(1)).current;

	const startBreathingExercise = () => {
		setActiveExercise('breathing');
		setBreathingCount(0);
		breathingCycle();
	};

	const breathingCycle = () => {
		setBreathingPhase('inhale');
		Animated.timing(breathingAnimation, {
			toValue: 1.5,
			duration: 4000,
			useNativeDriver: true,
		}).start(() => {
			setBreathingPhase('hold');
			setTimeout(() => {
				setBreathingPhase('exhale');
				Animated.timing(breathingAnimation, {
					toValue: 1,
					duration: 8000,
					useNativeDriver: true,
				}).start(() => {
					setBreathingCount(prev => prev + 1);
					if (breathingCount < 4) {
						breathingCycle();
					} else {
						setActiveExercise(null);
						setBreathingCount(0);
					}
				});
			}, 7000);
		});
	};

	const stopExercise = () => {
		setActiveExercise(null);
		setBreathingCount(0);
		breathingAnimation.setValue(1);
	};

	const renderBreathingExercise = () => (
		<View style={styles.exerciseContainer}>
			<Text style={styles.exerciseTitle}>Exercício de respiração 4-7-8</Text>
			<Text style={styles.exerciseSubtitle}>
				Inspire por 4 segundos, segure por 7, expire por 8
			</Text>

			<View style={styles.breathingContainer}>
				<Animated.View
					style={[
						styles.breathingCircle,
						{
							transform: [{ scale: breathingAnimation }],
							backgroundColor: breathingPhase === 'inhale' ? '#4CAF50' :
								breathingPhase === 'hold' ? '#FF9800' : '#2196F3'
						}
					]}
				>
					<Text style={styles.breathingText}>
						{breathingPhase === 'inhale' ? 'Inspire' :
							breathingPhase === 'hold' ? 'Segure' : 'Expire'}
					</Text>
				</Animated.View>
			</View>

			<Text style={styles.breathingCount}>Respiração {breathingCount + 1} de 5</Text>

			<TouchableOpacity style={styles.stopButton} onPress={stopExercise}>
				<Text style={styles.stopButtonText}>Parar Exercício</Text>
			</TouchableOpacity>
		</View>
	);

	const renderGroundingExercise = () => (
		<View style={styles.exerciseContainer}>
			<Text style={styles.exerciseTitle}>Técnica 5-4-3-2-1</Text>
			<Text style={styles.exerciseSubtitle}>
				Identifique 5 coisas que você vê, 4 que pode tocar, 3 que pode ouvir, 2 que pode cheirar, 1 que pode saborear
			</Text>

			<ScrollView style={styles.groundingSteps}>
				<View style={styles.groundingStep}>
					<Text style={styles.stepNumber}>5</Text>
					<Text style={styles.stepText}>Coisas que você VÊ</Text>
					<Text style={styles.stepHint}>Olhe ao seu redor e identifique 5 objetos</Text>
				</View>
				<View style={styles.groundingStep}>
					<Text style={styles.stepNumber}>4</Text>
					<Text style={styles.stepText}>Coisas que você pode TOCAR</Text>
					<Text style={styles.stepHint}>Toque em 4 objetos diferentes</Text>
				</View>
				<View style={styles.groundingStep}>
					<Text style={styles.stepNumber}>3</Text>
					<Text style={styles.stepText}>Coisas que você pode OUVIR</Text>
					<Text style={styles.stepHint}>Prestar atenção aos sons ao redor</Text>
				</View>
				<View style={styles.groundingStep}>
					<Text style={styles.stepNumber}>2</Text>
					<Text style={styles.stepText}>Coisas que você pode CHEIRAR</Text>
					<Text style={styles.stepHint}>Identificar 2 aromas diferentes</Text>
				</View>
				<View style={styles.groundingStep}>
					<Text style={styles.stepNumber}>1</Text>
					<Text style={styles.stepText}>Coisa que você pode SABOREAR</Text>
					<Text style={styles.stepHint}>Pensar em algo que você gosta de comer</Text>
				</View>
			</ScrollView>

			<TouchableOpacity style={styles.stopButton} onPress={stopExercise}>
				<Text style={styles.stopButtonText}>Concluir Exercício</Text>
			</TouchableOpacity>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<ConfigHeader title="Ferramentas de coping" onBack={() => router.back()} />

			{activeExercise ? (
				<View style={styles.exerciseView}>
					{activeExercise === 'breathing' && renderBreathingExercise()}
					{activeExercise === 'grounding' && renderGroundingExercise()}
				</View>
			) : (
				<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Ferramentas disponíveis</Text>
						<Text style={styles.sectionSubtitle}>
							Escolha uma ferramenta para ajudar você a lidar com momentos difíceis
						</Text>
					</View>

					<TouchableOpacity
						style={styles.toolCard}
						onPress={startBreathingExercise}
					>
						<View style={styles.toolCardContent}>
							<View style={styles.toolIconContainer}>
								<Ionicons name="leaf" size={24} color="#4CAF50" />
							</View>
							<View style={styles.toolInfo}>
								<Text style={styles.toolTitle}>Exercício de respiração 4-7-8</Text>
								<Text style={styles.toolDescription}>
									Técnica de respiração para acalmar a mente e reduzir a ansiedade
								</Text>
							</View>
							<Ionicons name="play-circle" size={24} color="#4CAF50" />
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.toolCard}
						onPress={() => setActiveExercise('grounding')}
					>
						<View style={styles.toolCardContent}>
							<View style={styles.toolIconContainer}>
								<Ionicons name="eye" size={24} color="#2196F3" />
							</View>
							<View style={styles.toolInfo}>
								<Text style={styles.toolTitle}>Técnica 5-4-3-2-1</Text>
								<Text style={styles.toolDescription}>
									Exercício de aterramento para conectar com o momento presente
								</Text>
							</View>
							<Ionicons name="play-circle" size={24} color="#2196F3" />
						</View>
					</TouchableOpacity>

					<View style={styles.infoSection}>
						<Text style={styles.infoTitle}>Dicas importantes</Text>
						<View style={styles.infoCard}>
							<Ionicons name="information-circle" size={20} color={Colors.light.tint} />
							<Text style={styles.infoText}>
								Estas ferramentas são para apoio e não substituem ajuda profissional.
							</Text>
						</View>
						<View style={styles.infoCard}>
							<Ionicons name="heart" size={20} color={Colors.light.tint} />
							<Text style={styles.infoText}>
								Pratique regularmente para obter melhores resultados.
							</Text>
						</View>
					</View>
				</ScrollView>
			)}
		</SafeAreaView>
	);
};
