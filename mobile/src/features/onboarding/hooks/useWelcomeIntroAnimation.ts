import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

export function useWelcomeIntroAnimation() {
	const [showContent, setShowContent] = useState(false);
	const [showWhiteTransition, setShowWhiteTransition] = useState(false);
	const contentFadeAnim = useRef(new Animated.Value(0)).current;
	const welcomeFadeAnim = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		const timer = setTimeout(() => {
			Animated.timing(welcomeFadeAnim, {
				toValue: 0,
				duration: 600,
				useNativeDriver: true,
			}).start(() => {
				requestAnimationFrame(() => {
					setShowWhiteTransition(true);

					setTimeout(() => {
						requestAnimationFrame(() => {
							setShowContent(true);
							Animated.timing(contentFadeAnim, {
								toValue: 1,
								duration: 800,
								useNativeDriver: true,
							}).start();
						});
					}, 300);
				});
			});
		}, 2000);

		return () => clearTimeout(timer);
	}, [contentFadeAnim, welcomeFadeAnim]);

	return {
		showContent,
		showWhiteTransition,
		contentFadeAnim,
		welcomeFadeAnim,
	};
}
