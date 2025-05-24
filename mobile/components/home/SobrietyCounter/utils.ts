import { Milestone } from './types';
import { MILESTONES } from './constants';

export function getMilestone(days: number): Milestone {
	return MILESTONES.reduce((prev, curr) => {
		return days >= curr.days ? curr : prev;
	});
}
