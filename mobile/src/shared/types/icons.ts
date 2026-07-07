import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export type IoniconName = ComponentProps<typeof Ionicons>['name'];
export type MaterialCommunityIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
