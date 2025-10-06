
import { useSimpleTheme } from "@/contexts/SimpleTheme";

export const light = {
	primary: "#9b6bff",
	secondary: "#b29cff",
	background: "#F5F5F7",
	cardBackground: "#fff",
	text: "#000",
	textSecondary: "#757575ff",
	workColor: "#6366F1",      // Bleu indigo pour le travail
	breakColor: "#EC4899",     // Rose/magenta pour la pause
};

export const dark = {
	primary: "#9b6bff",
	secondary: "#b29cff",
	background: "#0b0b0d",
	cardBackground: "#16151aff",
	text: "#fff",
	textSecondary: "#bdbdbd",
	workColor: "#818CF8",      // Bleu indigo plus clair pour le travail
	breakColor: "#F472B6",     // Rose plus clair pour la pause
};

export const useThemeColors = () => {
	const { effectiveScheme } = useSimpleTheme();
	return effectiveScheme === "dark" ? dark : light;
};
