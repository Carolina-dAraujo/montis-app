import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthScreenWrapper } from '@/mobile/components/AuthScreenWrapper';
import { AuthInput } from '@/mobile/components/ui/AuthInput';
import { GoogleLoginButton } from '@/mobile/components/ui/GoogleLoginButton';
import { Colors } from '@/mobile/constants/Colors';

const RegisterScreen: React.FC = () => {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    return (
        <AuthScreenWrapper title="Cadastrar-se">
            <AuthInput
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
            />
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
                <Text style={styles.primaryButtonText}>Criar conta</Text>
            </TouchableOpacity>

            <GoogleLoginButton onPress={() => console.log('Google signup')} />

            <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.switchText}>Já tem conta? Entrar</Text>
            </TouchableOpacity>
        </AuthScreenWrapper>
    );
};

export default RegisterScreen;

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
});
