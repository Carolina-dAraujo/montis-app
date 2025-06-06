import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

export const UnsavedChangesModal: React.FC<Props> = ({ visible, onCancel, onConfirm }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <Text style={styles.title}>Você tem informações não salvas.</Text>
                    <Text style={styles.subtitle}>Deseja sair mesmo assim?</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={onCancel} style={[styles.button, styles.secondary]}>
                            <Text style={styles.secondaryText}>Continuar editando</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onConfirm} style={[styles.button, styles.primary]}>
                            <Text style={styles.primaryText}>Sair sem salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 24,
        width: "80%",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#555",
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 4,
    },
    primary: {
        backgroundColor: "#ef4444",
    },
    secondary: {
        backgroundColor: "#e5e7eb",
    },
    primaryText: {
        color: "white",
        fontWeight: "600",
    },
    secondaryText: {
        color: "#111827",
        fontWeight: "600",
    },
});