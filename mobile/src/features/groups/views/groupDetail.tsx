import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '@/shared/theme/colors';
import { useGroupDetail } from '@/features/groups/hooks/useGroupDetail';
import { GroupDetailHeader } from '@/features/groups/components/GroupDetailHeader';
import { GroupDetailLoading } from '@/features/groups/components/GroupDetailLoading';
import { GroupLocationCard } from '@/features/groups/components/GroupLocationCard';
import { GroupScheduleList } from '@/features/groups/components/GroupScheduleList';
import { styles } from '@/features/groups/styles/groupDetail.styles';

export default function GroupDetail() {
	const {
		group,
		loading,
		shimmerAnim,
		handleNotificationToggle,
		handleMeetingNotificationToggle,
		handleCall,
		copyAddress,
		openInMaps,
		openInGoogleMaps,
		openInWaze,
		handleRemoveGroup,
		goBack,
	} = useGroupDetail();

	if (loading) {
		return <GroupDetailLoading shimmerAnim={shimmerAnim} onBack={goBack} />;
	}

	if (!group) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.errorContainer}>
					<MaterialCommunityIcons
						name="alert-circle"
						size={48}
						color={Colors.icon.gray}
					/>
					<Text style={styles.errorText}>Grupo não encontrado</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<GroupDetailHeader
				title={group.name}
				notificationsEnabled={!!group.notificationsEnabled}
				onBack={goBack}
				onToggleNotifications={() => handleNotificationToggle(!group.notificationsEnabled)}
				onRemove={handleRemoveGroup}
			/>

			<ScrollView showsVerticalScrollIndicator={false}>
				<GroupLocationCard
					group={group}
					onCall={handleCall}
					onCopyAddress={copyAddress}
					onOpenInMaps={openInMaps}
					onOpenInGoogleMaps={openInGoogleMaps}
					onOpenInWaze={openInWaze}
				/>
				<GroupScheduleList
					group={group}
					onMeetingNotificationToggle={handleMeetingNotificationToggle}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}
