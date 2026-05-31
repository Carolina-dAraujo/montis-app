import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 0,
        backgroundColor: '#fff',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        backgroundColor: '#fff',
        minHeight: 48,
    },
    backIconWrapper: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    backButton: {
        padding: 8,
    },
    dateText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Inter',
        fontWeight: 'semibold',
        color: '#000000',
        backgroundColor: '#fff',
    },
    weekdaysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 4,
        marginBottom: 2,
        backgroundColor: '#fff',
    },
    weekdayCell: {
        width: 46,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    weekdayText: {
        fontSize: 13,
        color: '#000000',
        fontFamily: 'Inter-Medium',
        backgroundColor: '#fff',
    },
    datesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 4,
        marginBottom: 8,
        backgroundColor: '#fff',
    },
    dayButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        borderWidth: 0,
        backgroundColor: '#E3E3E3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayButtonToday: {
        backgroundColor: '#3B82F6',
    },
    dayButtonSelected: {
        borderWidth: 3,
        borderColor: '#1F2937',
        backgroundColor: '#F3F4F6',
    },
    dayButtonWithData: {
        backgroundColor: '#10B981',
    },
    dayNumber: {
        fontSize: 16,
        color: '#595858',
        fontFamily: 'Inter',
        backgroundColor: 'transparent',
    },
    dayNumberToday: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },
    dayNumberSelected: {
        color: '#1F2937',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },
    scrollContent: {
        paddingBottom: 120,
        backgroundColor: '#fff',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 32,
        backgroundColor: '#fff',
        paddingTop: 0,
    },
    saveButtonContainerScroll: {
        marginTop: 24,
        marginBottom: 24,
    },
    saveButton: {
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    saveButtonActive: {
        backgroundColor: '#254A8E',
    },
    saveButtonInactive: {
        backgroundColor: '#D1D5DB',
    },
    saveButtonText: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
    },
    saveButtonTextActive: {
        color: '#fff',
    },
    saveButtonTextInactive: {
        color: '#fff',
    },
}); 