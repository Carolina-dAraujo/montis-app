import React, { useEffect, useState } from "react";
import { View, Alert, BackHandler, StyleSheet } from "react-native";
import { OptionSelector } from "components/daily-tracking/option-selector";
import { SubmitButton } from "components/daily-tracking/submit-button";
import { UnsavedChangesModal } from "components/daily-tracking/unsaved-changes-modal";

interface Props {
    initialValues: {
        alcohol: string | null;
        exercise: string | null;
        feelings: string | null;
    };
    onSubmit: (data: { alcohol: string; exercise: string; feelings: string }) => void;
    isUpdating: boolean;
    isSubmitting: boolean;
}

export const FormWrapper: React.FC<Props> = ({ initialValues, onSubmit, isUpdating, isSubmitting }) => {
    const [alcohol, setAlcohol] = useState<string | null>(initialValues.alcohol);
    const [exercise, setExercise] = useState<string | null>(initialValues.exercise);
    const [feelings, setFeelings] = useState<string | null>(initialValues.feelings);
    const [showModal, setShowModal] = useState(false);
    const [attemptingToGoBack, setAttemptingToGoBack] = useState(false);

    const hasChanges =
        alcohol !== initialValues.alcohol ||
        exercise !== initialValues.exercise ||
        feelings !== initialValues.feelings;

    const canSubmit = alcohol && exercise && feelings && (!isUpdating || hasChanges);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            if (hasChanges) {
                setShowModal(true);
                setAttemptingToGoBack(true);
                return true;
            }
            return false;
        });
        return () => backHandler.remove();
    }, [hasChanges]);

    const handleExit = () => {
        setShowModal(false);
        if (attemptingToGoBack) {
            // Replace with actual navigation
            console.log("Navigating back");
        }
    };

    return (
        <View style={styles.container}>
            <OptionSelector
                title="Consumo de álcool"
                options={["Nenhum", "Moderado", "Excessivo"]}
                selected={alcohol}
                onSelect={setAlcohol}
            />
            <OptionSelector
                title="Exercício físico"
                options={["Nenhum", "Leve", "Intenso"]}
                selected={exercise}
                onSelect={setExercise}
            />
            <OptionSelector
                title="Sentimentos"
                options={["Triste", "Neutro", "Feliz"]}
                selected={feelings}
                onSelect={setFeelings}
            />

            <SubmitButton
                isUpdating={isUpdating}
                isDisabled={!canSubmit}
                isLoading={isSubmitting}
                onPress={() =>
                    onSubmit({ alcohol: alcohol!, exercise: exercise!, feelings: feelings! })
                }
            />

            <UnsavedChangesModal
                visible={showModal}
                onConfirm={handleExit}
                onCancel={() => {
                    setShowModal(false);
                    setAttemptingToGoBack(false);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
});