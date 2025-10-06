import { useThemeColors } from "@/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
	const navigation = useNavigation();
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
		</Tabs>
	);
}
