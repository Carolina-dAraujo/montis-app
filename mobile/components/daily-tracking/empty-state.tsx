import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const EmptyState: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Você não pode registrar dias futuros.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center",
    },
});