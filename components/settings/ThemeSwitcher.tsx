import { useThemeColors } from "@/constants/color";
import { SPACING } from "@/constants/spacing";
import { useSimpleTheme } from "@/contexts/SimpleTheme";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ThemeMode = "auto" | "light" | "dark";

// labelKey refers to translation keys in the i18n JSON files
const options: { key: ThemeMode; labelKey: string }[] = [
	{ key: "auto", labelKey: "THEME_OPTIONS.AUTO" },
	{ key: "light", labelKey: "THEME_OPTIONS.LIGHT" },
	{ key: "dark", labelKey: "THEME_OPTIONS.DARK" },
];

export const ThemeSwitcher = () => {
	const { mode, setMode } = useSimpleTheme();
	const { t } = useTranslation();
	const COLORS = useThemeColors();

	return (
		<View style={styles.container}>
			{options.map((o) => (
				<TouchableOpacity
					key={o.key}
					onPress={() => setMode(o.key)}
					style={[styles.option, mode === o.key && { borderColor: COLORS.primary }]}
				>
					<View style={[styles.radio, mode === o.key && { backgroundColor: COLORS.primary }]} />
					<Text style={[styles.label, { color: COLORS.text }]}>{t(o.labelKey)}</Text>
				</TouchableOpacity>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	option: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "transparent",
		padding: SPACING.small,
		borderRadius: SPACING.radius,
	},
	radio: {
		width: 14,
		height: 14,
		borderRadius: 7,
		borderWidth: 1,
		borderColor: "#999",
		marginRight: SPACING.small,
	},
	label: {
		fontSize: 14,
	},
});
