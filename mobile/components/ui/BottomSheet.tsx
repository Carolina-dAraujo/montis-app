import { View, StyleSheet, Modal, Pressable, Animated, Dimensions } from 'react-native';
import { Colors } from '@/mobile/constants/Colors';
import { useEffect, useRef, useState } from 'react';

interface BottomSheetProps {
	visible: boolean;
	onClose: () => void;
	children: React.ReactNode;
	height?: number;
	withFade?: boolean;
	onSave?: () => void;
}

export function BottomSheet({ visible, onClose, children, height, withFade = true, onSave }: BottomSheetProps) {
	const slideAnim = useRef(new Animated.Value(0)).current;
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const { height: screenHeight } = Dimensions.get('window');
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		if (visible) {
			setIsAnimating(false);
			const animations = [
				Animated.spring(slideAnim, {
					toValue: 1,
					useNativeDriver: true,
					bounciness: 0,
					speed: 5
				}),
			];

			if (withFade) {
				animations.push(
					Animated.timing(fadeAnim, {
						toValue: 1,
						duration: 300,
						useNativeDriver: true,
					})
				);
			}

			Animated.parallel(animations).start();
		}
	}, [visible]);

	const handleClose = () => {
		if (isAnimating) return;

		setIsAnimating(true);

		const animations = [
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 400,
				useNativeDriver: true,
			}),
		];

		if (withFade) {
			animations.push(
				Animated.timing(fadeAnim, {
					toValue: 0,
					duration: 400,
					useNativeDriver: true,
				})
			);
		}

		Animated.parallel(animations).start(() => {
			onClose();
			setIsAnimating(false);

		});
	};

	if (!visible) return null;

	return (
		<Modal
			visible={visible}
			transparent
			animationType="none"
			onRequestClose={handleClose}
		>
			<Animated.View
				style={[
					styles.modalOverlay,
					withFade && {
						opacity: fadeAnim,
					},
				]}
			>
				<Pressable
					style={styles.pressable}
					onPress={handleClose}
				>
					<Animated.View
						style={[
							styles.bottomSheet,
							{
								height: height || screenHeight * 0.2,
								transform: [{
									translateY: slideAnim.interpolate({
										inputRange: [0, 1],
										outputRange: [screenHeight, 0],
									}),
								}],
							},
						]}
					>
						<Pressable style={{ flex: 1 }} onPress={(e) => e.stopPropagation()}>
							<View style={styles.bottomSheetHandle} />
							{children}
						</Pressable>
					</Animated.View>
				</Pressable>
			</Animated.View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'flex-end',
	},
	pressable: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	bottomSheet: {
		backgroundColor: Colors.light.background,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingTop: 12,
		paddingBottom: 32,
	},
	bottomSheetHandle: {
		width: 40,
		height: 4,
		backgroundColor: Colors.light.shadow,
		borderRadius: 2,
		alignSelf: 'center',
		marginBottom: 16,
	},
});

