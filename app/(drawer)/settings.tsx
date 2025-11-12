import CategoriesModal from "@/components/settings/CategoriesModal";
import { LanguageSwitcher } from "@/components/settings/LanguageSwitcher";
import PlayerSettingsToggle from "@/components/settings/PlayerSettingsToggle";
import { ThemeSwitcher } from "@/components/settings/ThemeSwitcher";
import { WaterReminderToggle } from "@/components/settings/WaterReminderToggle";
import { HeaderTitle } from "@/components/ui/HeaderTitle";
import { useThemeColors } from "@/constants/color";
import SPACING from "@/constants/spacing";
import TYPOGRAPHY from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";
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
						accessibilityRole="button"
						accessibilityLabel={t("PLAYER_SETTINGS.CATEGORIES_BUTTON")}
					>
						<Text style={[styles.categoriesButtonText, { color: COLORS.text }]}>
							{t("PLAYER_SETTINGS.CATEGORIES_BUTTON")}
						</Text>
						<Ionicons
							name="chevron-forward"
							size={18}
							color={COLORS.textSecondary}
							accessible={false}
						/>
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
	} as ViewStyle,
	sectionTitle: {
		fontSize: TYPOGRAPHY.sizes.lg,
		fontWeight: TYPOGRAPHY.weights.bold,
		marginTop: 16,
		marginBottom: 12,
	} as TextStyle,
	categoriesButton: {
		marginTop: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		height: 48,
		paddingHorizontal: SPACING.large,
		paddingVertical: 0,
		borderRadius: SPACING.radius.lg,
		borderWidth: 1,
	} as ViewStyle,
	categoriesButtonText: {
		fontWeight: TYPOGRAPHY.weights.semibold,
		fontSize: TYPOGRAPHY.sizes.md,
	} as TextStyle,
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "flex-end",
	} as ViewStyle,
	modalContent: {
		maxHeight: "80%",
	} as ViewStyle,
	modalCard: {
		marginBottom: 0,
		borderBottomLeftRadius: SPACING.radius.lg,
		borderBottomRightRadius: SPACING.radius.lg,
	} as ViewStyle,
	modalTitle: {
		fontSize: TYPOGRAPHY.sizes.lg,
		fontWeight: TYPOGRAPHY.weights.bold,
		marginBottom: SPACING.large,
	} as TextStyle,
	closeButton: {
		marginTop: SPACING.large,
		padding: SPACING.large,
		borderRadius: SPACING.radius.lg,
		alignItems: "center",
	} as ViewStyle,
	closeButtonText: {
		color: "#fff",
		fontWeight: TYPOGRAPHY.weights.semibold,
		fontSize: TYPOGRAPHY.sizes.base,
	} as TextStyle,
});
