import CategorySelector from "@/components/settings/CategorySelector";
import { LanguageSwitcher } from "@/components/settings/LanguageSwitcher";
import PlayerSettingsToggle from "@/components/settings/PlayerSettingsToggle";
import { ThemeSwitcher } from "@/components/settings/ThemeSwitcher";
import { WaterReminderToggle } from "@/components/settings/WaterReminderToggle";
import { HeaderTitle } from "@/components/ui/HeaderTitle";
import { useThemeColors } from "@/constants/color";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
	const COLORS = useThemeColors();
	const { t } = useTranslation();
	const [showCategoriesModal, setShowCategoriesModal] = React.useState(false);
	const [lofiEnabled, setLofiEnabled] = React.useState<boolean | null>(null);

	React.useEffect(() => {
		(async () => {
			try {
				const raw = await AsyncStorage.getItem("@fokuz:lofi_enabled");
				setLofiEnabled(raw === null ? true : raw === "true");
			} catch {
				setLofiEnabled(true);
			}
		})();
	}, []);

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
			<PlayerSettingsToggle onChange={(v) => setLofiEnabled(v)} />

			{lofiEnabled && (
				<>
					<Pressable
						style={{
							marginTop: 12,
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							padding: 12,
							borderRadius: 10,
							borderWidth: 1,
							borderColor: COLORS.border,
							backgroundColor: COLORS.card,
						}}
						onPress={() => setShowCategoriesModal(true)}
					>
						<Text style={{ color: COLORS.text, fontWeight: "600" }}>{t("PLAYER_SETTINGS.CATEGORIES_BUTTON")}</Text>
						<Ionicons name="chevron-down" size={18} color={COLORS.textSecondary} />
					</Pressable>

					<Modal visible={showCategoriesModal} transparent animationType="slide" onRequestClose={() => setShowCategoriesModal(false)}>
						<Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 20 }} onPress={() => setShowCategoriesModal(false)}>
							<Pressable style={{ backgroundColor: COLORS.card, borderRadius: 12, padding: 16, maxHeight: '80%' }} onPress={(e) => e.stopPropagation()}>
								<Text style={[styles.titlebis, { color: COLORS.text }]}>{t("PLAYER_SETTINGS.CATEGORIES")}</Text>
								<CategorySelector compact />
								<Pressable onPress={() => setShowCategoriesModal(false)} style={{ marginTop: 12, alignSelf: "flex-end" }}>
									<Text style={{ color: COLORS.primary, fontWeight: "600" }}>{t("MODAL.CONFIRM.CANCEL_BUTTON")}</Text>
								</Pressable>
							</Pressable>
						</Pressable>
					</Modal>
				</>
			)}
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
