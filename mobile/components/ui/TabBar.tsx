import React, { JSX } from 'react';
import { View, StyleSheet } from 'react-native';
import { PlatformPressable } from '@react-navigation/elements';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors } from '@/mobile/constants/Colors';
import Entypo from '@expo/vector-icons/Entypo';
import Foundation from '@expo/vector-icons/Foundation';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import type { IconProps } from '@expo/vector-icons/build/createIconSet';

const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const { light } = Colors;

    const icons: Record<string, (props: Partial<IconProps<any>>) => JSX.Element> = {
        home: (props) => <Entypo name="home" size={26} {...props} />,
        grupos: (props) => <FontAwesome6 name="users" size={26} {...props} />,
        crise: (props) => <Foundation name="alert" size={30} {...props} />,
        agenda: (props) => <FontAwesome6 name="calendar-days" size={26} {...props} />,
        ajuda: (props) => <FontAwesome6 name="hand-holding-medical" size={26} {...props} />,
    };

    // Only show the 5 main tabs
    const visibleRoutes = state.routes.filter(route => 
        ['home', 'grupos', 'crise', 'agenda', 'ajuda'].includes(route.name)
    );

    return (
        <View style={styles.tabbar}>
            {visibleRoutes.map((route, idx) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === idx;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                const iconColor = route.name === 'crise'
                    ? light.iconAlert
                    : isFocused
                        ? light.tabIconSelected
                        : light.icon;

                return (
                    <PlatformPressable
                        key={route.name}
                        style={styles.tabbarItem}
                        android_ripple={{
                            color: light.shadow,
                            borderless: false,
                            radius: 12,
                        }}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                    >
                        {icons[route.name]?.({ color: iconColor })}
                    </PlatformPressable>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
        marginHorizontal: 2,
        paddingVertical: 15,
        borderCurve: 'continuous',
        borderTopWidth: 1,
        borderTopColor: Colors.light.shadow,
    },
    tabbarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        borderRadius: 12,
        overflow: 'hidden',
    },
});

export default TabBar;
