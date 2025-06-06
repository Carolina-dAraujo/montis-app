import React from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WeekCalendar } from "components/agenda/week-calendar";
import { FormWrapper } from "components/daily-tracking/form-wrapper";
import { EmptyState } from "components/daily-tracking/empty-state";
import dayjs from "dayjs";

export default function DailyTrackingScreen() {
    const { date } = useLocalSearchParams();
    const router = useRouter();

    // Simula dados recuperados do backend (substituir com dados reais)
    const savedData = {
        alcohol: "Moderado",
        exercise: "Leve",
        feelings: "Feliz",
    };

    const isFuture = new Date(date as string) > new Date();
    const isUpdating = !!savedData;

    const handleSubmit = async (data: typeof savedData) => {
        // Substituir por chamada real à API
        console.log("Enviando:", data);
        router.replace("/agenda");
    };

    return (
        <View style={styles.container}>
            <WeekCalendar
                selectedDate={date as string}
                onSelectDate={(newDate: string) => router.replace(`/tracking/${newDate}`)}
                currentDate={dayjs()}
            />
            {isFuture ? (
                <EmptyState />
            ) : (
                <FormWrapper
                    initialValues={savedData}
                    onSubmit={handleSubmit}
                    isUpdating={isUpdating}
                    isSubmitting={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
});
