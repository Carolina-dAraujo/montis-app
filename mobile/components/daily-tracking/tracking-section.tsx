import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
                {options.map((option) => {
                    const isSelected = selectedValue === option.id;
                    const IconComponent = option.icon;
                    return (
                        <View key={option.id} style={styles.optionWrapper}>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    {
                                        borderColor: isSelected ? option.color : '#E5E7EB',
                                        borderWidth: isSelected ? 3 : 2,
                                        backgroundColor: '#fff',
                                    },
                                ]}
                                onPress={() => onValueChange(option.id)}
                                activeOpacity={0.8}
                            >
                                <IconComponent
                                    size={36}
                                    color={isSelected ? option.color : '#111'}
                                />
                            </TouchableOpacity>
                            <Text style={styles.optionText} numberOfLines={2} ellipsizeMode="tail">
                                {option.label}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 32,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        color: '#111827',
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    optionsRow: {
        flexDirection: 'row',
        gap: 16,
        backgroundColor: '#fff',
        paddingBottom: 4,
    },
    optionWrapper: {
        alignItems: 'center',
        width: 90,
        backgroundColor: '#fff',
    },
    optionButton: {
        width: 90,
        height: 90,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 6,
    },
    optionText: {
        fontSize: 13,
        fontFamily: 'Inter-Medium',
        textAlign: 'center',
        color: '#111',
        backgroundColor: '#fff',
    },
});