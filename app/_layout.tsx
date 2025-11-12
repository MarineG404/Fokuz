import { useThemeColors } from "@/constants/color";
import { AudioProvider } from "@/contexts/AudioContext";
import { CustomMethodsProvider } from "@/contexts/CustomMethodsContext";
import { SimpleThemeProvider, useSimpleTheme } from "@/contexts/SimpleTheme";
import { TimerProvider } from "@/contexts/TimerContext";
import "@/src/localization/i18n";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
	View,
	ViewStyle,
	TextStyle
} from "react-native";
import "react-native-reanimated";

function InnerLayout() {
	const { effectiveScheme } = useSimpleTheme();
	const COLORS = useThemeColors();

	return (
		// Ensure the app always has a themed background behind screens
		<View style={{ flex: 1, backgroundColor: COLORS.background }}>
			<ThemeProvider value={effectiveScheme === "dark" ? DarkTheme : DefaultTheme}>
				<Stack>
					<Stack.Screen name="(drawer)" options={{ headerShown: false }} />
					<Stack.Screen name="method" options={{ headerShown: false }} />
				</Stack>
				<StatusBar style="auto" />
			</ThemeProvider>
		</View>
	);
}

export const unstable_settings = {
	anchor: "(drawer)",
};

export default function RootLayout() {
	return (
		<SimpleThemeProvider>
			<CustomMethodsProvider>
				<AudioProvider>
					<TimerProvider>
						<InnerLayout />
					</TimerProvider>
				</AudioProvider>
			</CustomMethodsProvider>
		</SimpleThemeProvider>
	);
}
