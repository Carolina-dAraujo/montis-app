import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';

interface SwitchAuthTextProps {
    text: string;
    actionText: string;
    onPress: () => void;
}

export const SwitchAuthText: React.FC<SwitchAuthTextProps> = ({ text, actionText, onPress }) => (
    <Text style={styles.switchText}>
        {text} <Text style={styles.linkText} onPress={onPress}>{actionText}</Text>
    </Text>
);

const styles = StyleSheet.create({
    switchText: {
        textAlign: 'center',
        color: Colors.light.text,
    },
    linkText: {
        fontWeight: '600',
        color: Colors.light.text,
    },
});