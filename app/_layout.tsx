import { SimpleThemeProvider, useSimpleTheme } from "@/contexts/SimpleTheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

function InnerLayout() {
	const { effectiveScheme } = useSimpleTheme();

	return (
		<ThemeProvider value={effectiveScheme === "dark" ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen name="(drawer)" options={{ headerShown: false }} />
				<Stack.Screen name="method" options={{ headerShown: false }} />
			</Stack>
			<StatusBar style="auto" />
		</ThemeProvider>
	);
}

export const unstable_settings = {
	anchor: "(drawer)",
};

export default function RootLayout() {
	return (
		<SimpleThemeProvider>
			<InnerLayout />
		</SimpleThemeProvider>
	);
}

