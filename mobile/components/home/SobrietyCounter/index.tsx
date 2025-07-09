import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import { MILESTONES } from './constants';
import { getMilestone } from './utils';
import { MilestoneItem } from './MilestoneItem';
import { Connector } from './Connector';
import { useOnboarding } from '@/mobile/contexts/OnboardingContext';

export function SobrietyCounter() {
	const { onboardingData } = useOnboarding();
	const today = new Date();
	
	// Determine which date to use for calculation
	let sobrietyDate: Date;
	
	if (onboardingData?.sobrietyStartDate) {
		// User is currently sober and has a start date
		sobrietyDate = new Date(onboardingData.sobrietyStartDate);
	} else if (onboardingData?.lastDrinkDate) {
		// User is not currently sober, use last drink date
		sobrietyDate = new Date(onboardingData.lastDrinkDate);
	} else {
		// Fallback to today if no dates available
		sobrietyDate = today;
	}
	
	const days = Math.ceil(Math.abs(today.getTime() - sobrietyDate.getTime()) / (1000 * 60 * 60 * 24));
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
