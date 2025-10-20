import { useThemeColors } from "@/constants/color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

type Variant = "primary" | "muted" | "outline";

interface AppButtonProps {
	title?: string;
	onPress?: () => void;
	iconName?: string;
	variant?: Variant;
	style?: ViewStyle | ViewStyle[];
	textStyle?: any;
	activeOpacity?: number;
}

const AppButton: React.FC<AppButtonProps> = ({
	title,
	onPress,
	iconName,
	variant = "primary",
	style,
	textStyle,
	activeOpacity = 0.8,
}) => {
	const COLORS = useThemeColors();

	const backgroundColor =
		variant === "primary"
			? COLORS.primary
			: variant === "muted"
				? // muted button from theme
					// @ts-ignore newest key exists on COLORS
					(COLORS as any).mutedButton || "rgba(0,0,0,0.06)"
				: "transparent";

	const color = variant === "primary" ? "#fff" : COLORS.text;

	return (
		<TouchableOpacity
			style={[styles.button, { backgroundColor }, style]}
			onPress={onPress}
			activeOpacity={activeOpacity}
		>
			{iconName ? (
				<Ionicons name={iconName as any} size={16} color={color} style={styles.icon} />
			) : null}
			{title ? <Text style={[styles.text, { color }, textStyle]}>{title}</Text> : null}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		flexDirection: "row",
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 12,
		minWidth: 120,
		alignItems: "center",
		justifyContent: "center",
		elevation: 0,
	},
	text: {
		fontSize: 16,
		fontWeight: "600",
	},
	icon: {
		marginRight: 6,
	},
});

export default AppButton;
