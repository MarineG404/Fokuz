import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import "react-native-reanimated";

export const unstable_settings = {
	anchor: "(drawer)",
};

export default function RootLayout() {
	const colorScheme = useColorScheme();

	return (
		<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen name="(drawer)" options={{ headerShown: false }} />
				<Stack.Screen name="method" options={{ headerShown: false }} />
			</Stack>
			<StatusBar style="auto" />
		</ThemeProvider>
	);
}

