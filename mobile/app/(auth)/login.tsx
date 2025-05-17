import React, { useState } from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
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
        <AuthScreenWrapper title="Entrar">
            <AuthInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <AuthInput
                placeholder="Senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
            />
            <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Entrar</Text>
            </TouchableOpacity>

            <GoogleLoginButton onPress={() => console.log('Google login')} />

            <TouchableOpacity>
                <Text style={styles.switchText}>Não tem conta? Cadastre-se</Text>
            </TouchableOpacity>
        </AuthScreenWrapper>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    primaryButton: {
        backgroundColor: Colors.light.text,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    switchText: {
        textAlign: 'center',
        color: Colors.light.text,
        marginTop: 8,
    },
})
