import { StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        paddingBottom: 16,
        paddingRight: 20,
        width: '100%',
    },
    	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		width: '100%',
	},
	backButton: {
		padding: 8,
	},
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        flex: 1,
        flexWrap: 'wrap',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    serviceIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: Colors.input,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: Colors.light.text,
    },

    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    serviceCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    serviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
        flex: 1,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    typeText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    serviceInfo: {
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: Colors.light.text,
        marginLeft: 8,
    },
    specialtiesContainer: {
        marginTop: 8,
    },
    specialtiesTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 8,
    },
    specialtiesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    specialtyBadge: {
        backgroundColor: Colors.containers.blue,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    specialtyText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    contactButton: {
        backgroundColor: Colors.containers.blue,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    contactButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
