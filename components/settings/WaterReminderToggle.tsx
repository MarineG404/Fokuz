import ToggleRow from "@/components/settings/ToggleRow";
import { useThemeColors } from "@/constants/color";
import { SPACING } from "@/constants/spacing";
import { useWaterReminder } from "@/hooks/useWaterReminder";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export function WaterReminderToggle() {
	const COLORS = useThemeColors();
	const { t } = useTranslation();
	const { isActive, startReminders, stopReminders, sendTestReminder } = useWaterReminder();

	const handleToggle = async () => {
		if (isActive) {
			stopReminders();
		} else {
			await startReminders();
		}
	};

	const handleTest = () => {
		Alert.alert(t("WATER_REMINDER.TEST.TITLE"), t("WATER_REMINDER.TEST.MESSAGE"), [
			{ text: t("MODAL.CONFIRM.CANCEL_BUTTON"), style: "cancel" },
			{
				text: t("WATER_REMINDER.TEST.SEND_BUTTON"),
				onPress: sendTestReminder,
			},
		]);
	};

	return (
		<View style={styles.container}>
			<ToggleRow
				title={t("WATER_REMINDER.TITLE")}
				subtitle={
					isActive ? t("WATER_REMINDER.STATUS.ACTIVE") : t("WATER_REMINDER.STATUS.INACTIVE")
				}
				iconName={"water"}
				active={isActive}
				onToggle={handleToggle}
			/>

			{isActive && (
				<Pressable
					style={[
						styles.testButton,
						{
							backgroundColor: COLORS.primary,
						},
					]}
					onPress={handleTest}
					accessibilityRole="button"
					accessibilityLabel={t("WATER_REMINDER.TEST_BUTTON")}
				>
					<Ionicons name="flask" size={16} color="#FFFFFF" accessible={false} />
					<Text style={styles.testButtonText}>{t("WATER_REMINDER.TEST_BUTTON")}</Text>
				</Pressable>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 0,
	},
	toggleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderRadius: SPACING.radius,
		borderWidth: 1,
	},
	iconTextContainer: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	textContainer: {
		flex: 1,
	},
	title: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 2,
	},
	subtitle: {
		fontSize: 14,
	},
	switch: {
		width: 50,
		height: 30,
		borderRadius: 15,
		justifyContent: "center",
		position: "relative",
	},
	switchThumb: {
		width: 26,
		height: 26,
		borderRadius: 13,
		position: "absolute",
	},
	testButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: SPACING.small,
		paddingVertical: SPACING.small,
		paddingHorizontal: SPACING.large,
		borderRadius: SPACING.radius,
		minHeight: 44,
	},
	testButtonText: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "600",
		marginLeft: SPACING.small,
	},
});
