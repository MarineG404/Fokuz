
import { useSimpleTheme } from "@/contexts/SimpleTheme";

export const light = {
	primary: "#9b6bff",
	secondary: "#b29cff",
	background: "#F5F5F7",
	cardBackground: "#fff",
	text: "#000",
	textSecondary: "#757575ff",
	workColor: "#4F46E5",      // Bleu indigo plus intense
	breakColor: "#E11D48",     // Rose plus vif et contrasté
};

export const dark = {
	primary: "#9b6bff",
	secondary: "#b29cff",
	background: "#0b0b0d",
	cardBackground: "#16151aff",
	text: "#fff",
	textSecondary: "#bdbdbd",
	workColor: "#6366F1",      // Bleu indigo vif pour le travail
	breakColor: "#EC4899",     // Rose vif pour la pause
};

export const useThemeColors = () => {
	const { effectiveScheme } = useSimpleTheme();
	return effectiveScheme === "dark" ? dark : light;
};
