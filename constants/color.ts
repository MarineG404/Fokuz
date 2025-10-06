import { useColorScheme } from "react-native";

export const light = {
	primary: "#9b6bff",
	secondary: "#b29cff",
	background: "#F5F5F7",
	cardBackground: "#fff",
	text: "#000",
	textSecondary: "#757575ff",
};

export const dark = {
	primary: "#9b6bff",
	secondary: "#b29cff",
	background: "#0b0b0d",
	cardBackground: "#16151aff",
	text: "#fff",
	textSecondary: "#bdbdbd",
};

export const useThemeColors = () => {
	const scheme = useColorScheme();
	return scheme === "dark" ? dark : light;
};
