import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, GestureResponderEvent, View } from 'react-native';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useRouter } from 'expo-router';
import { AuthScreenWrapper } from '@/mobile/components/AuthScreenWrapper';
import { AuthInput } from '@/mobile/components/ui/AuthInput';
import { GoogleLoginButton } from '@/mobile/components/ui/GoogleLoginButton';
import { Colors } from '@/mobile/constants/Colors';

const RegisterScreen: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    return (
        <AuthScreenWrapper title="Cadastro">
            <AuthInput
                label="EMAIL"
                placeholder=""
                value={email}
                onChangeText={setEmail}
            />
            <AuthInput
                label="SENHA"
                placeholder=""
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
            />

            <PrimaryButton
                title="Cadastrar"
                onPress={function (_event: GestureResponderEvent): void {
                    throw new Error('Function not implemented.');
                }}
            />

            <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.linkText}>
                    JÁ TEM UMA CONTA? <Text style={styles.linkBold}>FAZER LOGIN</Text>
                </Text>
            </TouchableOpacity>

            <View style={styles.separatorContainer}>
                <View style={styles.line} />
                <Text style={styles.separatorText}>ou</Text>
                <View style={styles.line} />
            </View>

            <GoogleLoginButton
                title="CADASTRAR COM O GOOGLE"
                onPress={() => console.log('Google signup')}
            />
        </AuthScreenWrapper>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    linkText: {
        textAlign: 'center',
        fontSize: 8,
        color: Colors.light.text,
        marginTop: 0,
        marginBottom: 4
    },
    linkBold: {
        fontWeight: 'bold',
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.light.icon,
    },
    separatorText: {
        marginHorizontal: 10,
        fontSize: 12,
        color: Colors.light.icon,
    },
});
