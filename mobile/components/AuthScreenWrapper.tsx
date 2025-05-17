import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';

type AuthScreenWrapperProps = {
    title: string;
    children: React.ReactNode;
};

export const AuthScreenWrapper: React.FC<AuthScreenWrapperProps> = ({ title, children }) => (
    <View style={styles.wrapper}>
        <Text style={styles.title}>{title}</Text>
        {children}
    </View>
);

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: Colors.light.background,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 32,
        color: Colors.light.text,
    },
});
