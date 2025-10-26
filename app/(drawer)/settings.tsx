import { LanguageSwitcher } from "@/components/settings/LanguageSwitcher";
import PlayerSettingsToggle from "@/components/settings/PlayerSettingsToggle";
import { ThemeSwitcher } from "@/components/settings/ThemeSwitcher";
import { WaterReminderToggle } from "@/components/settings/WaterReminderToggle";
import { HeaderTitle } from "@/components/ui/HeaderTitle";
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
			<Text style={[styles.titlebis, { color: COLORS.secondary }]}> {t("THEME_SETTINGS")}</Text>
			<ThemeSwitcher />

			<Text style={[styles.titlebis, { color: COLORS.secondary }]}>{t("LANGUAGE_SETTINGS")}</Text>
			<LanguageSwitcher />

			<Text style={[styles.titlebis, { color: COLORS.secondary }]}>
				{t("WATER_REMINDER_SETTINGS")}
			</Text>
			<WaterReminderToggle />

			<Text style={[styles.titlebis, { color: COLORS.secondary }]}>{t("PLAYER_SETTINGS")}</Text>
			<PlayerSettingsToggle />
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
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: 12,
	},
	label: { fontSize: 16, fontWeight: "600" },
	note: { marginTop: 8, fontSize: 14 },
});
