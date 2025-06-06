import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";

interface Props {
    isUpdating: boolean;
    isDisabled: boolean;
    isLoading?: boolean;
    onPress: () => void;
}

export const SubmitButton: React.FC<Props> = ({ isUpdating, isDisabled, isLoading = false, onPress }) => {
    const label = isUpdating ? "Atualizar informações" : "Registrar";

    return (
        <TouchableOpacity
            style={[styles.button, isDisabled && styles.disabled]}
            onPress={onPress}
            disabled={isDisabled || isLoading}
        >
            {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
            ) : (
                <Text style={styles.label}>{label}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#2563EB",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 24,
    },
    label: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
    disabled: {
        backgroundColor: "#9CA3AF",
    },
});