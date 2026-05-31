import { StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 10,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 16,
    },
    headerSpacer: {
        width: 32,
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 20,
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: Colors.light.icon,
        lineHeight: 20,
        marginBottom: 16,
    },
    emergencyCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: Colors.light.shadow,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    emergencyCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emergencyIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    emergencyInfo: {
        flex: 1,
    },
    emergencyName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 4,
    },
    emergencyNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.tint,
        marginBottom: 4,
    },
    emergencyDescription: {
        fontSize: 14,
        color: Colors.light.icon,
    },
    copingCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: Colors.light.shadow,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    copingCardContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    copingIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    copingInfo: {
        flex: 1,
    },
    copingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 4,
    },
    copingDescription: {
        fontSize: 14,
        color: Colors.light.icon,
        lineHeight: 20,
    },
    linkCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: Colors.light.shadow,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    linkCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    linkInfo: {
        flex: 1,
    },
    linkTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 4,
    },
    linkDescription: {
        fontSize: 14,
        color: Colors.light.icon,
        lineHeight: 20,
    },
    infoCard: {
        backgroundColor: Colors.lightGray,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    infoText: {
        fontSize: 14,
        color: Colors.light.text,
        marginLeft: 12,
        flex: 1,
        lineHeight: 20,
    },
});
