import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, GestureResponderEvent, View, Alert } from 'react-native';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useRouter } from 'expo-router';
import { AuthScreenWrapper } from '../../components/AuthScreenWrapper';
import { AuthInput } from '../../components/ui/AuthInput';
import { GoogleLoginButton } from '../../components/ui/GoogleLoginButton';
import { Colors } from '@/mobile/constants/Colors';
import { useAuth } from '../../contexts/AuthContext';

const LoginScreen: React.FC = () => {
    const router = useRouter();
    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Email validation function
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async (event: GestureResponderEvent) => {
        event.preventDefault();

        // Prevent multiple submissions
        if (isSubmitting || isLoading) {
            console.log('Login - Already submitting, ignoring request');
            return;
        }

        setErrors({});
        setIsSubmitting(true);
        console.log('Login - Starting login process');

        try {
            // Enhanced validation
            const trimmedEmail = email.trim();
            const trimmedPassword = senha.trim();

            // Email validation
            if (!trimmedEmail) {
                setErrors({ email: 'Email é obrigatório' });
                setIsSubmitting(false);
                return;
            }

            if (!validateEmail(trimmedEmail)) {
                setErrors({ email: 'Digite um email válido' });
                setIsSubmitting(false);
                return;
            }

            // Password validation
            if (!trimmedPassword) {
                setErrors({ password: 'Senha é obrigatória' });
                setIsSubmitting(false);
                return;
            }

            if (trimmedPassword.length < 8) {
                setErrors({ password: 'Senha deve ter pelo menos 8 caracteres' });
                setIsSubmitting(false);
                return;
            }

            // Use auth context to login
            await login(trimmedEmail, trimmedPassword);
            console.log('Login - Login successful, navigation should happen automatically');

        } catch (error: any) {
            console.error('Login error:', error);

            // Handle specific login errors
            if (error.message.includes('Email ou senha incorretos') ||
                error.message.includes('Invalid email or password')) {
                Alert.alert(
                    'Erro no Login',
                    'Email ou senha incorretos. Verifique suas credenciais.',
                    [
                        {
                            text: 'Esqueci a Senha',
                            onPress: () => {
                                // TODO: Implement forgot password
                                console.log('Forgot password');
                            },
                        },
                        {
                            text: 'OK',
                            style: 'cancel',
                        },
                    ]
                );
            } else if (error.message.includes('Network request failed') ||
                error.message.includes('Não foi possível conectar')) {
                Alert.alert(
                    'Erro de Conexão',
                    'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
                    [{ text: 'OK' }]
                );
            } else {
                Alert.alert(
                    'Erro',
                    'Erro ao fazer login. Tente novamente.',
                    [{ text: 'OK' }]
                );
            }
        } finally {
            setIsSubmitting(false);
            console.log('Login - Login process completed');
        }
    };

    return (
        <AuthScreenWrapper title="Login">
            <AuthInput
                label="EMAIL"
                placeholder="Digite seu email"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setErrors(prev => ({ ...prev, email: undefined }));
                }}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />

            <AuthInput
                label="SENHA"
                placeholder="Digite sua senha"
                value={senha}
                onChangeText={(text) => {
                    setSenha(text);
                    setErrors(prev => ({ ...prev, password: undefined }));
                }}
                secureTextEntry
                error={errors.password}
                autoCapitalize="none"
                autoCorrect={false}
            />

            <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>ESQUECEU SUA SENHA?</Text>
            </TouchableOpacity>

            <PrimaryButton
                title={isSubmitting || isLoading ? "Entrando..." : "Login"}
                onPress={handleLogin}
                disabled={isSubmitting || isLoading}
            />

            <TouchableOpacity onPress={() => router.push('/(auth)/cadastro')}>
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
        fontSize: 8,
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
