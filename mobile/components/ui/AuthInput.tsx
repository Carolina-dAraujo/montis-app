import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';

interface AuthInputProps extends TextInputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
}

export const AuthInput: React.FC<AuthInputProps> = ({placeholder, value, onChangeText, secureTextEntry, ...rest}) => (
    <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.light.text}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        {...rest}
    />
);

const styles = StyleSheet.create({
    input: {
        height: 48,
        borderColor: Colors.light.icon,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
        backgroundColor: '#fff',
        color: Colors.light.text,
    },
});
