import React, { useState } from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';
import { Colors } from '@/mobile/constants/Colors';

interface AuthInputProps extends TextInputProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    error?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
    label, 
    placeholder, 
    value, 
    onChangeText, 
    secureTextEntry, 
    error,
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[
                    styles.input, 
                    isFocused && styles.inputFocused,
                    error && styles.inputError
                ]}
                placeholder={placeholder}
                placeholderTextColor={Colors.icon.gray}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...rest}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

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
    inputFocused: {
        borderColor: Colors.containers.blue,
        shadowColor: Colors.containers.blue,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    inputError: {
        borderColor: '#FF3B30',
    },
    container: {
        marginBottom: 8,
    },
    label: {
        fontSize: 10,
        fontWeight: '500',
        fontFamily: 'Roboto',
        color: Colors.light.text,
        marginBottom: 4,
        textAlign: 'left',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 10,
        marginTop: 2,
        marginLeft: 4,
    },
});
