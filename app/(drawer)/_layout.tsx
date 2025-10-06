import { useThemeColors } from "@/constants/color";
import { Drawer } from "expo-router/drawer";
import React from "react";

export default function DrawerLayout() {
	const COLORS = useThemeColors();

	return (
		<Drawer
			screenOptions={{
				headerShown: false,
				drawerStyle: {
					width: 200, // drawer plus fin
					backgroundColor: COLORS.cardBackground,
				},
				drawerActiveTintColor: COLORS.primary,
				drawerInactiveTintColor: COLORS.textSecondary,
				drawerLabelStyle: { fontSize: 16 },
			}}
		>
			<Drawer.Screen name="(tabs)" options={{ title: "Home" }} />
			<Drawer.Screen name="settings" options={{ title: "Paramètres" }} />
		</Drawer>
	);
}
