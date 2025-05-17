import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';

interface GoogleLoginButtonProps {
    onPress: () => void;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onPress }) => (
    <TouchableOpacity style={styles.googleButton} onPress={onPress}>
        <Text style={styles.googleButtonText}>Entrar com Google</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    googleButton: {
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: Colors.light.icon,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    googleButtonText: {
        color: Colors.light.text,
        fontWeight: '500',
        fontSize: 16,
    },
});