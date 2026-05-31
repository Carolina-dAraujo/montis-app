import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import { MILESTONES } from './constants';
import { getMilestone } from './utils';
import { MilestoneItem } from './MilestoneItem';
import { Connector } from './Connector';
import { useOnboarding } from '@/features/onboarding/context/OnboardingProvider';
import { useSobrietyData } from '@/features/sobriety/hooks/useSobrietyData';

function computeDaysFromDate(sobrietyDate: Date): number {
	const today = new Date();
	return Math.ceil(
		Math.abs(today.getTime() - sobrietyDate.getTime()) / (1000 * 60 * 60 * 24),
	);
}

export function SobrietyCounter() {
	const { onboardingData } = useOnboarding();
	const { data: sobrietyData } = useSobrietyData();

	const days = useMemo(() => {
		if (sobrietyData?.totalDays != null && sobrietyData.totalDays >= 0) {
			return sobrietyData.totalDays;
		}

		const today = new Date();
		let sobrietyDate: Date;

		if (onboardingData?.sobrietyStartDate) {
			sobrietyDate = new Date(onboardingData.sobrietyStartDate);
		} else if (onboardingData?.lastDrinkDate) {
			sobrietyDate = new Date(onboardingData.lastDrinkDate);
		} else {
			sobrietyDate = today;
		}

		return computeDaysFromDate(sobrietyDate);
	}, [sobrietyData, onboardingData]);

	const currentMilestone = getMilestone(days);

	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<View style={styles.content}>
					<Text style={styles.label}>dias de sobriedade</Text>
					<Text style={styles.days}>{days}</Text>

					<View style={styles.milestoneContainer}>
						{MILESTONES.map((milestone, index) => {
							const isCompleted = days >= milestone.days;
							const isCurrent = milestone === currentMilestone;

							return (
								<React.Fragment key={milestone.days}>
									<MilestoneItem
										milestone={milestone}
										isCompleted={isCompleted}
										isCurrent={isCurrent}
									/>

									{index < MILESTONES.length - 1 && (
										<Connector
											isCompleted={days >= MILESTONES[index + 1].days}
										/>
									)}
								</React.Fragment>
							);
						})}
					</View>
				</View>
			</View>
		</View>
	);
}
