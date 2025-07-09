import { View, Text, StyleSheet, Pressable } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Colors } from '@/mobile/constants/Colors';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/mobile/contexts/AuthContext';

export function HomeHeader() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const currentDate = new Date();
    
    const day = currentDate.getDate();
    const month = currentDate.toLocaleDateString('pt-BR', { month: 'long' });
    const year = currentDate.getFullYear();
    const formattedDate = `${day} de ${month}, ${year}`;

    const greeting = () => {
        const hour = currentDate.getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
            <View style={styles.textContainer}>
                <Text style={styles.mainText}>
                    {greeting()}, <Text style={styles.userName}>{user?.displayName || 'Usuário'}</Text>
                </Text>
                <Text style={styles.date}>{formattedDate}</Text>
            </View>
            <Pressable
                style={styles.settingsButton}
                onPress={() => {
                    router.push('/config' as any);
                }}
            >
                <FontAwesome6 name="gear" size={20} color={Colors.icon.gray} />
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
        paddingBottom: 20,
        backgroundColor: Colors.light.background,
    },
    textContainer: {
        flex: 1,
    },
    mainText: {
        fontSize: 18,
        color: Colors.light.text,
        fontWeight: '400',
        marginBottom: 4,
    },
    userName: {
        fontWeight: 'bold',
    },
    date: {
        fontSize: 14,
        color: Colors.icon.gray,
        fontWeight: '400',
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.background,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.input,
    }
});