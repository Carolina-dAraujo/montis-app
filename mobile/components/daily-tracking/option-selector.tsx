import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
    title: string;
    options: string[];
    selected: string | null;
    onSelect: (value: string | null) => void;
}

export const OptionSelector: React.FC<Props> = ({ title, options, selected, onSelect }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.optionsRow}>
                {options.map((opt) => {
                    const isSelected = selected === opt;
                    return (
                        <TouchableOpacity
                            key={opt}
                            onPress={() => onSelect(isSelected ? null : opt)}
                            style={[styles.option, isSelected && styles.selected]}
                        >
                            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{opt}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
    },
    optionsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    option: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: "#E5E7EB",
    },
    selected: {
        backgroundColor: "#2563EB",
    },
    optionText: {
        color: "#1F2937",
    },
    optionTextSelected: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
});