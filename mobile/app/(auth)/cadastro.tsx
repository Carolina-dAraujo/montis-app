import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, GestureResponderEvent, View, Alert } from 'react-native';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useRouter } from 'expo-router';
import { AuthScreenWrapper } from '@/mobile/components/AuthScreenWrapper';
import { AuthInput } from '@/mobile/components/ui/AuthInput';
import { GoogleLoginButton } from '@/mobile/components/ui/GoogleLoginButton';
import { Colors } from '@/mobile/constants/Colors';
import { validatePassword } from '../../components/inputs/PasswordInput';
import { useAuth } from '../../contexts/AuthContext';

const RegisterScreen: React.FC = () => {
    const router = useRouter();
    const { register, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const handleRegister = async (event: GestureResponderEvent) => {
        event.preventDefault();
        setErrors({});

        try {
            // Client-side validation
            const passwordValidation = validatePassword(senha);
            if (!passwordValidation.isValid) {
                setErrors({ password: passwordValidation.error });
                return;
            }

            if (!email.trim()) {
                setErrors({ email: 'Email não pode estar vazio' });
                return;
            }

            // Use auth context to register
            await register(email.trim(), senha);

            // Success - auth context will handle navigation
            Alert.alert(
                'Sucesso!',
                'Conta criada com sucesso!',
                [{ text: 'OK' }]
            );

        } catch (error: any) {
            console.error('Registration error:', error);
            
            // Handle specific error types
            if (error.message.includes('Email inválido')) {
                setErrors({ email: 'Email inválido' });
            } else if (error.message.includes('Senha muito fraca')) {
                setErrors({ password: 'Senha muito fraca' });
            } else if (error.message.includes('Não foi possível criar a conta')) {
                Alert.alert(
                    'Erro no Cadastro',
                    'Não foi possível criar a conta. Verifique os dados e tente novamente.',
                    [
                        {
                            text: 'Tentar Login',
                            onPress: () => router.push('/login'),
                        },
                        {
                            text: 'OK',
                            style: 'cancel',
                        },
                    ]
                );
            } else {
                Alert.alert(
                    'Erro',
                    'Erro ao registrar usuário. Tente novamente.',
                    [{ text: 'OK' }]
                );
            }
        }
    };

    return (
        <AuthScreenWrapper title="Cadastro">
            <AuthInput
                label="EMAIL"
                placeholder=""
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setErrors(prev => ({ ...prev, email: undefined }));
                }}
                error={errors.email}
            />
            <AuthInput
                label="SENHA"
                placeholder=""
                value={senha}
                onChangeText={(text) => {
                    setSenha(text);
                    setErrors(prev => ({ ...prev, password: undefined }));
                }}
                secureTextEntry
                error={errors.password}
            />

            <PrimaryButton
                title={isLoading ? "Cadastrando..." : "Cadastrar"}
                onPress={handleRegister}
                disabled={isLoading}
            />

            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
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
