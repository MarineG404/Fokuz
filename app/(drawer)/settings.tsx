import { HeaderTitle } from "@/components/ui/HeaderTitle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { useThemeColors } from "@/constants/color";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
	const COLORS = useThemeColors();
	const { t } = useTranslation();

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
			<HeaderTitle title={t("SETTINGS")} showBack />
			{}
			<Text style={[styles.titlebis, { color: COLORS.secondary }]}> {t("THEME_SETTINGS")}</Text>
			<ThemeSwitcher />
			<Text style={[styles.titlebis, { color: COLORS.secondary }]}>{t("LANGUAGE_SETTINGS")}</Text>
			<LanguageSwitcher />
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
