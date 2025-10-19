import { useThemeColors } from "@/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
	const COLORS = useThemeColors();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: COLORS.primary,
				tabBarInactiveTintColor: COLORS.textSecondary,
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="history"
				options={{
					title: "Historique",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="document-text-outline" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
