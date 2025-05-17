import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, GestureResponderEvent, View } from 'react-native';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useRouter } from 'expo-router';
import { AuthScreenWrapper } from '../../components/AuthScreenWrapper';
import { AuthInput } from '../../components/ui/AuthInput';
import { GoogleLoginButton } from '../../components/ui/GoogleLoginButton';
import { Colors } from '@/mobile/constants/Colors';

const LoginScreen: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    return (
        <AuthScreenWrapper title="Login">
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

            <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            <PrimaryButton
                title="Login"
                onPress={function (_event: GestureResponderEvent): void {
                    throw new Error('Function not implemented.');
                }}
            />

            <TouchableOpacity onPress={() => router.push('/cadastro')}>
                <Text style={styles.linkText}>
                    AINDA NÃO TEM UMA CONTA? <Text style={styles.linkBold}>CADASTRE-SE</Text>
                </Text>
            </TouchableOpacity>

            <View style={styles.separatorContainer}>
                <View style={styles.line} />
                <Text style={styles.separatorText}>ou</Text>
                <View style={styles.line} />
            </View>

            <GoogleLoginButton title="ENTRAR COM O GOOGLE" onPress={() => console.log('Google login')} />
        </AuthScreenWrapper>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    forgotPassword: {
        alignItems: 'flex-start',
        marginTop: 8,
        marginBottom: 12,
    },
    forgotPasswordText: {
        color: Colors.light.text,
        fontSize: 10,
    },
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
