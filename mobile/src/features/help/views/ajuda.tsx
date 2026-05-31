import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/shared/theme/colors';
import { styles } from '@/features/help/styles/ajuda.styles';

export default function Ajuda() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Ajuda</Text>
                <Text style={styles.subtitle}>Recursos e suporte para sua jornada</Text>
            </View>
        </SafeAreaView>
    )
}
