import React from 'react';
import {StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import { Colors } from '@/mobile/constants/Colors';

interface GoogleLoginButtonProps {
    onPress: () => void,
    title?: string,
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onPress, title }) => (
    <TouchableOpacity style={styles.googleButton} onPress={onPress}>
        <Image
            source={require('@/mobile/assets/images/google.png')}
            style={styles.icon}
            resizeMode="contain"
        />
        <Text style={styles.googleButtonText}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: Colors.light.shadow,
        borderRadius: 8,
        marginBottom: 20,
    },
    googleButtonText: {
        color: Colors.light.text,
        fontWeight: 'semibold',
        fontSize: 10,
        fontFamily: 'Roboto',
    },
    icon: {
        width: 29,
        height: 29,
        marginRight: 12,
    },
});
