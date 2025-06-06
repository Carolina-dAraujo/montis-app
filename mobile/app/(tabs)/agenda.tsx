import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { MonthCalendar } from "components/agenda/month-calendar";
import { useRouter } from "expo-router";
import dayjs from "dayjs";

export default function AgendaScreen() {
    const router = useRouter();

    const handleDayPress = (date: string) => {
        router.push(`/tracking/${date}`);
    };

    return (
            <MonthCalendar
                onSelectDate={handleDayPress}
                currentMonth={dayjs()}
                selectedDate={""}
                filledDates={[]}
            />
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#FFF",
    },
});