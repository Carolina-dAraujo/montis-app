import { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/shared/theme/colors';
import { configLayoutStyles } from '@/features/settings/styles/configLayout.styles';

type ConfigHeaderProps = {
	title: string;
	onBack: () => void;
	rightAction?: ReactNode;
	backIcon?: 'chevron' | 'arrow';
	titleAlign?: 'left' | 'center';
	containerStyle?: StyleProp<ViewStyle>;
};

export function ConfigHeader({
	title,
	onBack,
	rightAction,
	backIcon = 'chevron',
	titleAlign = 'left',
	containerStyle,
}: ConfigHeaderProps) {
	if (backIcon === 'arrow') {
		return (
			<View style={[configLayoutStyles.header, containerStyle]}>
				<View style={configLayoutStyles.headerRow}>
					<TouchableOpacity onPress={onBack} style={configLayoutStyles.backButton}>
						<Ionicons name="arrow-back" size={24} color={Colors.light.text} />
					</TouchableOpacity>
					<Text style={[configLayoutStyles.title, { flex: 1, textAlign: 'center' }]}>
						{title}
					</Text>
					<View style={configLayoutStyles.headerSpacer} />
				</View>
			</View>
		);
	}

	const titleStyle = titleAlign === 'center'
		? configLayoutStyles.titleContainer
		: configLayoutStyles.titleContainerLeft;

	return (
		<View style={[configLayoutStyles.headerCompact, containerStyle]}>
			<View style={rightAction ? configLayoutStyles.headerRowSpaced : configLayoutStyles.headerRow}>
				<TouchableOpacity style={configLayoutStyles.backButton} onPress={onBack}>
					<ChevronLeft size={24} color={Colors.icon.gray} />
				</TouchableOpacity>
				<View style={titleStyle}>
					<Text style={titleAlign === 'center' ? configLayoutStyles.titleCentered : configLayoutStyles.title}>
						{title}
					</Text>
				</View>
				{rightAction ? (
					<View style={configLayoutStyles.rightAction}>{rightAction}</View>
				) : (
					<View style={configLayoutStyles.headerSpacer} />
				)}
			</View>
		</View>
	);
}
