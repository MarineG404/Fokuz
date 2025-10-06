import { useThemeColors } from "@/constants/color";
import { useSimpleTheme } from "@/contexts/SimpleTheme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ThemeMode = 'auto' | 'light' | 'dark';

const options: { key: ThemeMode; label: string }[] = [
	{ key: "auto", label: "Automatique" },
	{ key: "light", label: "Clair" },
	{ key: "dark", label: "Sombre" },
];

export const ThemeSwitcher = () => {
	const { mode, setMode } = useSimpleTheme();
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
					<Text style={[styles.label, { color: COLORS.text }]}>{o.label}</Text>
				</TouchableOpacity>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingVertical: 12,
	},
	option: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "transparent",
		padding: 8,
		borderRadius: 8,
	},
	radio: {
		width: 14,
		height: 14,
		borderRadius: 7,
		borderWidth: 1,
		borderColor: "#999",
		marginRight: 8,
	},
	label: {
		fontSize: 14,
	},
});
