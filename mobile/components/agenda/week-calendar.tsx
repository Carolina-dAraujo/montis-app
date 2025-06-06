import React from "react";
import { Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import dayjs from "dayjs";

interface Props {
    currentDate: dayjs.Dayjs;
    selectedDate: string;
    onSelectDate: (date: string) => void;
}

export const WeekCalendar: React.FC<Props> = ({ currentDate, selectedDate, onSelectDate }) => {
    const startOfWeek = currentDate.startOf("week");

    const days = Array.from({ length: 7 }).map((_, i) => {
        const date = startOfWeek.add(i, "day");
        return {
            label: date.format("dd"),
            day: date.date(),
            fullDate: date.format("YYYY-MM-DD"),
        };
    });

    return (
        <FlatList
            data={days}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.fullDate}
            renderItem={({ item }) => {
                const isSelected = item.fullDate === selectedDate;

                return (
                    <TouchableOpacity
                        onPress={() => onSelectDate(item.fullDate)}
                        style={[styles.day, isSelected && styles.selectedDay]}
                    >
                        <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>{item.label}</Text>
                        <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>{item.day}</Text>
                    </TouchableOpacity>
                );
            }}
        />
    );
};

const styles = StyleSheet.create({
    day: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 4,
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: "#E5E7EB",
    },
    selectedDay: {
        backgroundColor: "#1D4ED8",
    },
    dayLabel: {
        fontSize: 12,
        color: "#374151",
    },
    dayLabelSelected: {
        color: "#FFFFFF",
    },
    dayNumber: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
    },
    dayNumberSelected: {
        color: "#FFFFFF",
    },
});