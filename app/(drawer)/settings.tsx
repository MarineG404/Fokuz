import { HeaderTitle } from "@/components/HeaderTitle";
import { useThemeColors } from "@/constants/color";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
	const COLORS = useThemeColors();

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
			<HeaderTitle title="Paramètres" showBack />

		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	headerRow: {
		height: 56,
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		paddingHorizontal: 16,
	},
	backButton: {
		position: "absolute",
		left: 12,
		top: 16,
		padding: 6,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "700",
	},
	content: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
