import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import dayjs from "dayjs";

interface Props {
    currentMonth: dayjs.Dayjs;
    onSelectDate: (date: string) => void;
    selectedDate: string;
    filledDates: string[]; // datas com registros
}

export const MonthCalendar: React.FC<Props> = ({ currentMonth, onSelectDate, selectedDate, filledDates }) => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const startDay = startOfMonth.day();

    const daysInMonth = endOfMonth.date();

    const days = Array.from({ length: startDay + daysInMonth }).map((_, i) => {
        const day = i - startDay + 1;
        if (day <= 0) return null;
        const date = currentMonth.date(day).format("YYYY-MM-DD");
        return {
            label: String(day),
            date,
            isFilled: filledDates.includes(date),
            isSelected: selectedDate === date,
        };
    });

    return (
        <FlatList
            numColumns={7}
            data={days}
            keyExtractor={(item, idx) => item?.date || `empty-${idx}`}
            renderItem={({ item }) => {
                if (!item) return <View style={styles.emptyCell} />;

                return (
                    <TouchableOpacity
                        style={[styles.cell, item.isSelected && styles.selected, item.isFilled && styles.filled]}
                        onPress={() => onSelectDate(item.date)}
                    >
                        <Text style={styles.label}>{item.label}</Text>
                    </TouchableOpacity>
                );
            }}
        />
    );
};

const styles = StyleSheet.create({
    cell: {
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
        margin: 2,
        borderRadius: 8,
        backgroundColor: "#F3F4F6",
    },
    selected: {
        backgroundColor: "#1D4ED8",
    },
    filled: {
        borderWidth: 2,
        borderColor: "#10B981",
    },
    emptyCell: {
        width: 44,
        height: 44,
        margin: 2,
    },
    label: {
        color: "#111827",
    },
});