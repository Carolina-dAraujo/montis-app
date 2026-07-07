import React, { JSX } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { PlatformPressable } from '@react-navigation/elements';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/shared/theme/colors';
import Entypo from '@expo/vector-icons/Entypo';
import Foundation from '@expo/vector-icons/Foundation';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import type { IconProps } from '@expo/vector-icons/build/createIconSet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	TAB_BAR_BOTTOM_GAP,
	TAB_BAR_HORIZONTAL_INSET,
	TAB_BAR_PILL_HEIGHT,
} from '@/shared/components/ui/tabBarMetrics';

type TabIconProps = Partial<Pick<IconProps<string>, 'color' | 'size'>>;

const TAB_NAMES = ['home', 'groups', 'crisis', 'agenda', 'services'] as const;
const tabBarColors = Colors.tabBar;

function TabBarPillBackground() {
	return (
		<>
			<BlurView
				tint="light"
				intensity={tabBarColors.blurIntensity}
				experimentalBlurMethod="dimezisBlurView"
				style={StyleSheet.absoluteFill}
			/>
			<View
				style={[
					StyleSheet.absoluteFill,
					{
						backgroundColor: Platform.OS === 'android'
							? tabBarColors.androidFallback
							: tabBarColors.glassOverlay,
					},
				]}
			/>
		</>
	);
}

const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
	const insets = useSafeAreaInsets();

	const icons: Record<string, (props: TabIconProps) => JSX.Element> = {
		home: (props) => <Entypo name="home" size={24} {...props} />,
		groups: (props) => <FontAwesome6 name="users" size={22} {...props} />,
		crisis: (props) => <Foundation name="alert" size={26} {...props} />,
		agenda: (props) => <FontAwesome6 name="calendar-days" size={22} {...props} />,
		services: (props) => <FontAwesome6 name="hand-holding-medical" size={22} {...props} />,
	};

	const visibleRoutes = state.routes.filter((route) =>
		TAB_NAMES.includes(route.name as (typeof TAB_NAMES)[number]),
	);

	return (
		<View
			pointerEvents="box-none"
			style={[
				styles.outer,
				{
					paddingBottom: insets.bottom + TAB_BAR_BOTTOM_GAP,
					paddingHorizontal: TAB_BAR_HORIZONTAL_INSET,
				},
			]}
		>
			<View style={styles.shadowWrap}>
				<View style={styles.pill}>
					<TabBarPillBackground />
					<View style={styles.pillContent}>
						{visibleRoutes.map((route) => {
							const { options } = descriptors[route.key];
							const isFocused = state.routes[state.index].key === route.key;

							const onPress = () => {
								const event = navigation.emit({
									type: 'tabPress',
									target: route.key,
									canPreventDefault: true,
								});

								if (!isFocused && !event.defaultPrevented) {
									if (Platform.OS === 'ios') {
										void Haptics.selectionAsync();
									}
									navigation.navigate(route.name);
								}
							};

							const onLongPress = () => {
								navigation.emit({
									type: 'tabLongPress',
									target: route.key,
								});
							};

							const iconColor =
								route.name === 'crisis'
									? tabBarColors.crisis
									: isFocused
										? tabBarColors.iconActive
										: tabBarColors.iconInactive;

							return (
								<PlatformPressable
									key={route.name}
									style={styles.tabbarItem}
									android_ripple={{
										color: tabBarColors.iconActiveGlass,
										borderless: true,
										radius: 22,
									}}
									accessibilityRole="button"
									accessibilityState={isFocused ? { selected: true } : {}}
									accessibilityLabel={options.tabBarAccessibilityLabel}
									testID={options.tabBarButtonTestID}
									onPress={onPress}
									onLongPress={onLongPress}
								>
									<View
										style={[
											styles.iconWrap,
											isFocused && route.name !== 'crisis' && styles.iconWrapFocused,
										]}
									>
										{icons[route.name]?.({ color: iconColor })}
									</View>
								</PlatformPressable>
							);
						})}
					</View>
				</View>
			</View>
		</View>
	);
};

const pillRadius = TAB_BAR_PILL_HEIGHT / 2;

const styles = StyleSheet.create({
	outer: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
	},
	shadowWrap: {
		borderRadius: pillRadius,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 6 },
				shadowOpacity: 0.05,
				shadowRadius: 20,
			},
			android: {
				elevation: 6,
			},
		}),
	},
	pill: {
		height: TAB_BAR_PILL_HEIGHT,
		borderRadius: pillRadius,
		overflow: 'hidden',
	},
	pillContent: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	tabbarItem: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	iconWrap: {
		width: 44,
		height: 36,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 18,
	},
	iconWrapFocused: {
		backgroundColor: tabBarColors.iconActiveGlass,
	},
});

export default TabBar;
