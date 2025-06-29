import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/mobile/constants/Colors';

const ajuda = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Ajuda</Text>
                <Text style={styles.subtitle}>Recursos e suporte para sua jornada</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.light.icon,
        textAlign: 'center',
    },
});

export default ajuda;