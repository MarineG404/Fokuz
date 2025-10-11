import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { HeaderTitle } from "@/components/ui/HeaderTitle";
import { useThemeColors } from "@/constants/color";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
	const COLORS = useThemeColors();

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
			<HeaderTitle title="Paramètres" showBack />
			<Text style={[styles.titlebis, { color: COLORS.secondary }]}>Thème de l'application</Text>
			<ThemeSwitcher />
			<Text style={[styles.titlebis, { color: COLORS.secondary }]}>Autres paramètres (à venir)</Text>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	titlebis: {
		fontSize: 20,
		fontWeight: "700",
		marginTop: 8,
		marginBottom: 8,
	},
});
