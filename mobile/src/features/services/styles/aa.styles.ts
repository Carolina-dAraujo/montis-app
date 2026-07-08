import { StyleSheet } from 'react-native';
import { Colors } from '@/shared/theme/colors';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	header: {
		paddingBottom: 16,
		paddingHorizontal: 20,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	backButton: {
		paddingRight: 8,
		paddingVertical: 8,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: Colors.light.text,
	},
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
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
	filters: {
		paddingHorizontal: 20,
		paddingBottom: 16,
	},
	filterButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		backgroundColor: Colors.lightGray,
		marginRight: 8,
	},
	filterButtonActive: {
		backgroundColor: Colors.containers.blue,
	},
	filterText: {
		fontSize: 14,
		color: Colors.icon.gray,
	},
	filterTextActive: {
		color: '#FFFFFF',
		fontWeight: 'bold',
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingVertical: 16,
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
	headerActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
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
		borderRadius: 8,
	},
	typeText: {
		fontSize: 12,
		color: '#FFFFFF',
		fontWeight: 'bold',
		marginLeft: 4,
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
		flexShrink: 1,
		flexWrap: 'nowrap',
	},
	loadingContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 40,
	},
	loadingText: {
		marginTop: 12,
		fontSize: 16,
		color: Colors.light.text,
	},
	badgesRow: {
		flexDirection: 'row',
		marginTop: 12,
		gap: 8,
	},
	feminineBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#E75480',
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	badgeText: {
		color: '#fff',
		fontSize: 12,
		marginLeft: 4,
		fontWeight: 'bold',
	},
	addedButton: {
		padding: 6,
		borderRadius: 16,
		backgroundColor: '#34C759',
		opacity: 0.8,
	},
	addButton: {
		padding: 6,
		borderRadius: 16,
		backgroundColor: Colors.containers.blue,
	},
	locationHintContainer: {
		paddingHorizontal: 20,
		paddingBottom: 12,
	},
	locationHintText: {
		fontSize: 13,
		color: Colors.icon.gray,
	},
	emptyStateContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 32,
		paddingHorizontal: 16,
	},
	emptyStateText: {
		fontSize: 15,
		color: Colors.icon.gray,
		textAlign: 'center',
	},
	expandSearchButton: {
		marginTop: 16,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 20,
		backgroundColor: Colors.containers.blue,
	},
	expandSearchButtonText: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
});
