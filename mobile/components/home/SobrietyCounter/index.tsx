import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import { MILESTONES } from './constants';
import { getMilestone } from './utils';
import { MilestoneItem } from './MilestoneItem';
import { Connector } from './Connector';

export function SobrietyCounter() {
	// TODO: Replace with actual sobriety date from user data
	const sobrietyDate = new Date('2025-05-15');
	const today = new Date();
	const days = Math.floor((today.getTime() - sobrietyDate.getTime()) / (1000 * 60 * 60 * 24));
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
