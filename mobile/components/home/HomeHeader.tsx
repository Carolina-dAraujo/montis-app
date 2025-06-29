import { View, Text, StyleSheet, Pressable } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Colors } from '@/mobile/constants/Colors';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function HomeHeader() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.toLocaleDateString('pt-BR', { month: 'long' });
    const year = currentDate.getFullYear();
    const formattedDate = `${day} de ${month}, ${year}`;

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
            <Text style={styles.date}>{formattedDate}</Text>
            <Pressable
                onPress={() => {
                    router.push('/config' as any);
                }}
            >
                <FontAwesome6 name="gear" size={24} color="black" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: Colors.light.background,
    },
    date: {
        fontSize: 18,
        color: Colors.light.text,
        fontWeight: 'bold',
    }
});