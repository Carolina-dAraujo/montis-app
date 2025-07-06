import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/mobile/constants/Colors';

type AuthScreenWrapperProps = {
    title: string;
    children: React.ReactNode;
};

export const AuthScreenWrapper: React.FC<AuthScreenWrapperProps> = ({
    title,
    children,
}) => (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.wrapper}>
            <Image
                source={require('@/mobile/assets/images/tree-leaf.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>{title}</Text>
            {children}
        </View>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    wrapper: {
        flex: 1,
        padding: 40,
        justifyContent: 'center',
        backgroundColor: Colors.light.background,
    },
    logo: {
        width: 36,
        height: 45,
        alignSelf: 'center',
        marginBottom: 0,
    },
    title: {
        fontSize: 38,
        fontWeight: 'bold',
        fontFamily: 'Inter-Bold',
        textAlign: 'center',
        marginBottom: 32,
        marginTop: 0,
        color: Colors.light.text,
    },
});
