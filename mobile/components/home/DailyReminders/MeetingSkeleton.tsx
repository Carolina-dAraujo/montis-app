import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';

interface MeetingSkeletonProps {
    count?: number;
}

export function MeetingSkeleton({ count = 2 }: MeetingSkeletonProps) {
    const animatedValues = useRef<Animated.Value[]>(
        Array(count).fill(0).map(() => new Animated.Value(0))
    ).current;

    useEffect(() => {
        const animations = animatedValues.map((value, index) =>
            Animated.loop(
                Animated.sequence([
                    Animated.timing(value, {
                        toValue: 1,
                        duration: 1000,
                        delay: index * 200,
                        useNativeDriver: false,
                    }),
                    Animated.timing(value, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: false,
                    }),
                ])
            )
        );

        animations.forEach(animation => animation.start());

        return () => {
            animations.forEach(animation => animation.stop());
        };
    }, [animatedValues]);

    const renderSkeletonItem = (index: number) => {
        const opacity = animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 0.7],
        });

        return (
            <View key={index} style={styles.skeletonItem}>
                <Animated.View style={[styles.skeletonIcon, { opacity }]} />
                <View style={styles.skeletonContent}>
                    <Animated.View style={[styles.skeletonTitle, { opacity }]} />
                    <Animated.View style={[styles.skeletonTime, { opacity }]} />
                    <Animated.View style={[styles.skeletonTag, { opacity }]} />
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {Array(count).fill(0).map((_, index) => renderSkeletonItem(index))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    skeletonItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E9ECEF',
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    skeletonIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.lightGray,
        marginRight: 16,
    },
    skeletonContent: {
        flex: 1,
        gap: 8,
    },
    skeletonTitle: {
        height: 18,
        backgroundColor: Colors.lightGray,
        borderRadius: 4,
        width: '70%',
    },
    skeletonTime: {
        height: 14,
        backgroundColor: Colors.lightGray,
        borderRadius: 4,
        width: '40%',
    },
    skeletonTag: {
        height: 12,
        backgroundColor: Colors.lightGray,
        borderRadius: 4,
        width: '20%',
        marginTop: 4,
    },
}); 