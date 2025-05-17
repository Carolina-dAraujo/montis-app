import React from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';
import { Colors } from '@/mobile/constants/Colors';

interface AuthInputProps extends TextInputProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
}

export const AuthInput: React.FC<AuthInputProps> = ({label, placeholder, value, onChangeText, secureTextEntry, ...rest}) => (
    <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={Colors.light.text}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            {...rest}
        />
    </View>
);

const styles = StyleSheet.create({
    input: {
        height: 38,
        borderColor: Colors.light.icon,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 1,
        backgroundColor: '#fff',
        color: Colors.light.text,
    },
    container: {
        marginBottom: 2,
    },
    label: {
        fontSize: 10,
        fontWeight: '500',
        fontFamily: 'Roboto',
        color: Colors.light.text,
        marginBottom: 4,
        textAlign: 'left',
    },
});
