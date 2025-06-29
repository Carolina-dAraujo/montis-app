import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/mobile/constants/Colors';
import { router } from 'expo-router';

const crise = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Crise</Text>
                <Text style={styles.subtitle}>Você está enfrentando uma crise?</Text>
                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <Text style={styles.buttonText}>Preciso de Ajuda</Text>
                    </TouchableOpacity>
                </View>
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
        marginBottom: 30,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        backgroundColor: Colors.light.tint,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default crise;