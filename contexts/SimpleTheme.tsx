import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type ThemeMode = "auto" | "light" | "dark";

type ThemeContextType = {
	mode: ThemeMode;
	setMode: (mode: ThemeMode) => void;
	effectiveScheme: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = "theme_preference";

export function SimpleThemeProvider({ children }: { children: React.ReactNode }) {
	const [mode, setModeState] = useState<ThemeMode>("auto");
	const systemScheme = useColorScheme();

	// Load saved preference on mount
	useEffect(() => {
		AsyncStorage.getItem(THEME_KEY)
			.then((saved) => {
				if (saved === "auto" || saved === "light" || saved === "dark") {
					setModeState(saved);
				}
			})
			.catch(() => {
				// Silent fail, keep default
			});
	}, []);

	// Custom setMode that saves to storage
	const setMode = async (newMode: ThemeMode) => {
		setModeState(newMode);
		try {
			await AsyncStorage.setItem(THEME_KEY, newMode);
		} catch {
			// Silent fail, mode still works
		}
	};

	const effectiveScheme =
		mode === "auto"
			? systemScheme === "dark"
				? "dark"
				: "light"
			: mode === "dark"
				? "dark"
				: "light";

	return (
		<ThemeContext.Provider value={{ mode, setMode, effectiveScheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useSimpleTheme() {
	const context = useContext(ThemeContext);
	const systemScheme = useColorScheme();
	if (!context) {
		return {
			mode: "auto" as ThemeMode,
			setMode: () => {},
			effectiveScheme: (systemScheme === "dark" ? "dark" : "light") as "light" | "dark",
		};
	}
	return context;
}
