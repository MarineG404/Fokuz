import CategoriesModal from "@/components/settings/CategoriesModal";
import { LanguageSwitcher } from "@/components/settings/LanguageSwitcher";
import PlayerSettingsToggle from "@/components/settings/PlayerSettingsToggle";
import { ThemeSwitcher } from "@/components/settings/ThemeSwitcher";
import { WaterReminderToggle } from "@/components/settings/WaterReminderToggle";
import { HeaderTitle } from "@/components/ui/HeaderTitle";
import { useThemeColors } from "@/constants/color";
import SPACING from "@/constants/spacing";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
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

	// Subscribe to changes
	React.useEffect(() => {
		const interval = setInterval(async () => {
			try {
				const raw = await AsyncStorage.getItem("@fokuz:lofi_enabled");
				setLofiEnabled(raw === null ? true : raw === "true");
			} catch {
				// ignore
			}
		}, 500);
		return () => clearInterval(interval);
	}, []);

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
			<HeaderTitle title={t("SETTINGS")} showBack />

			<ScrollView showsVerticalScrollIndicator={false}>
				<Text style={[styles.sectionTitle, { color: COLORS.secondary }]}>
					{t("THEME_SETTINGS")}
				</Text>
				<ThemeSwitcher />

				<Text style={[styles.sectionTitle, { color: COLORS.secondary }]}>
					{t("LANGUAGE_SETTINGS")}
				</Text>
				<LanguageSwitcher />

				<Text style={[styles.sectionTitle, { color: COLORS.secondary }]}>
					{t("WATER_REMINDER_SETTINGS")}
				</Text>
				<WaterReminderToggle />

				<Text style={[styles.sectionTitle, { color: COLORS.secondary }]}>
					{t("PLAYER_SETTINGS")}
				</Text>
				<PlayerSettingsToggle />

				{lofiEnabled && (
					<Pressable
						style={[
							styles.categoriesButton,
							{
								borderColor: COLORS.border,
								backgroundColor: COLORS.card,
							},
						]}
						onPress={() => setShowCategoriesModal(true)}
					>
						<Text style={[styles.categoriesButtonText, { color: COLORS.text }]}>
							{t("PLAYER_SETTINGS.CATEGORIES_BUTTON")}
						</Text>
						<Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
					</Pressable>
				)}
			</ScrollView>

			<CategoriesModal
				visible={showCategoriesModal}
				onClose={() => setShowCategoriesModal(false)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "700",
		marginTop: 16,
		marginBottom: 12,
	},
	categoriesButton: {
		marginTop: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 14,
		borderRadius: 10,
		borderWidth: 1,
	},
	categoriesButtonText: {
		fontWeight: "600",
		fontSize: 16,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "flex-end",
	},
	modalContent: {
		maxHeight: "80%",
	},
	modalCard: {
		marginBottom: 0,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "700",
		marginBottom: SPACING.large,
	},
	closeButton: {
		marginTop: SPACING.large,
		padding: SPACING.large,
		borderRadius: SPACING.radius,
		alignItems: "center",
	},
	closeButtonText: {
		color: "#fff",
		fontWeight: "600",
		fontSize: 16,
	},
});
