import { useThemeColors } from "@/constants/color";
import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { uiStyles } from "../ui/uiStyles";

interface BlockCardProps {
	children: React.ReactNode;
	style?: StyleProp<ViewStyle>;
	padded?: boolean;
}

const BlockCard: React.FC<BlockCardProps> = ({ children, style, padded = true }) => {
	const COLORS = useThemeColors();

	const themeCardStyle = COLORS.text === "#000" ? uiStyles.cardLight : uiStyles.cardDark;

	return (
		<View
			style={[
				uiStyles.card,
				padded && uiStyles.cardPadded,
				themeCardStyle,
				{ backgroundColor: COLORS.cardBackground },
				style,
			]}
		>
			{children}
		</View>
	);
};

export default BlockCard;
