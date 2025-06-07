import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface TrackingOption {
    id: string;
    label: string;
    icon: any;
    color: string;
}

interface TrackingSectionProps {
    title: string;
    options: TrackingOption[];
    selectedValue: string;
    onValueChange: (value: string) => void;
}

export default function TrackingSection({ title, options, selectedValue, onValueChange }: TrackingSectionProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.optionsContainer}>
                {options.map((option) => {
                    const isSelected = selectedValue === option.id;
                    const IconComponent = option.icon;

                    return (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.optionButton,
                                {
                                    backgroundColor: isSelected ? option.color : '#FFFFFF',
                                    borderColor: isSelected ? option.color : '#E5E7EB',
                                },
                            ]}
                            onPress={() => onValueChange(option.id)}
                        >
                            <IconComponent
                                size={24}
                                color={isSelected ? '#FFFFFF' : option.color}
                            />
                            <Text
                                style={[
                                    styles.optionText,
                                    {
                                        color: isSelected ? '#FFFFFF' : '#111827',
                                    },
                                ]}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 32,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        color: '#111827',
        marginBottom: 16,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 2,
        minWidth: '45%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    optionText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        marginLeft: 8,
        flex: 1,
    },
});