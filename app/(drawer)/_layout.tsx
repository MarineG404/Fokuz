import TYPOGRAPHY from "@/constants/typography";
import { useThemeColors } from "@/constants/color";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { useTranslation } from "react-i18next";

export default function DrawerLayout() {
	const COLORS = useThemeColors();
	const { t } = useTranslation();

	return (
		<Drawer
			screenOptions={{
				headerShown: false,
				drawerStyle: {
					width: 200,
					backgroundColor: COLORS.cardBackground,
				},
				drawerActiveTintColor: COLORS.primary,
				drawerInactiveTintColor: COLORS.textSecondary,
				drawerLabelStyle: { fontSize: TYPOGRAPHY.sizes.base },
			}}
		>
			<Drawer.Screen name="(tabs)" options={{ title: t("HOME") }} />
			<Drawer.Screen name="settings" options={{ title: t("SETTINGS") }} />
		</Drawer>
	);
}
