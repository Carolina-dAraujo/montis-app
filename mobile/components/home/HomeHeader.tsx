import { View, Text, StyleSheet, Pressable } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Colors } from '@/mobile/constants/Colors';

export function HomeHeader() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.toLocaleDateString('pt-BR', { month: 'long' });
    const year = currentDate.getFullYear();
    const formattedDate = `${day} de ${month}, ${year}`;

    return (
        <View style={styles.container}>
            <Text style={styles.date}>{formattedDate}</Text>
            <Pressable
                onPress={() => {
                    // TODO: Implement config navigation
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
        paddingVertical: 16,
    },
    date: {
        fontSize: 18,
        color: Colors.light.text,
        fontWeight: 'bold',
    }
});