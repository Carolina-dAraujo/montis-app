import type { IoniconName, MaterialCommunityIconName } from '@/shared/types/icons';

export type Milestone =
	| {
			days: number;
			library: 'MaterialCommunityIcons';
			icon: MaterialCommunityIconName;
			iconCompleted: MaterialCommunityIconName;
	  }
	| {
			days: number;
			library: 'Ionicons';
			icon: IoniconName;
			iconCompleted: IoniconName;
	  };
