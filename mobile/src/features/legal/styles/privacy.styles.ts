import { StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        paddingRight: 12,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#222',
    },
    updated: {
        fontSize: 12,
        color: '#666',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 4,
    },
    paragraph: {
        fontSize: 14,
        color: '#444',
        lineHeight: 22,
    },
});
