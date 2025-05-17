import {TouchableOpacity, Text, GestureResponderEvent, StyleSheet} from "react-native";
import {Colors} from "@/mobile/constants/Colors";

interface PrimaryButtonProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    disabled?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, onPress, disabled }) => (
    <TouchableOpacity
        style={[styles.primaryButton, disabled && styles.disabledButton]}
        onPress={onPress}
        disabled={disabled}
    >
        <Text style={[styles.buttonText, disabled && styles.disabledButtonText]}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    primaryButton: {
        backgroundColor: Colors.light.icon,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    disabledButton: {
        backgroundColor: Colors.light.background,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    disabledButtonText: {
        color: '#ccc',
    },
});