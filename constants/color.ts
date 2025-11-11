import { useSimpleTheme } from "@/contexts/SimpleTheme";

export const light = {
	primary: "#8151e5",
	secondary: "#b29cff",
	background: "#F5F5F7",
	cardBackground: "#fff",
	card: "#fff",
	text: "#000",
	textSecondary: "#707070",
	border: "#E5E7EB",
	workColor: "#4F46E5", // Bleu indigo plus intense
	breakColor: "#E11D48", // Rose plus vif et contrasté
	mutedButton: "#E5E7EB",
};

export const dark = {
	primary: "#9b6bff",
	secondary: "#b29cff",
	background: "#0b0b0d",
	cardBackground: "#16151aff",
	card: "#16151aff",
	text: "#fff",
	textSecondary: "#bdbdbd",
	border: "#2F3136",
	workColor: "#6366F1", // Bleu indigo vif pour le travail
	breakColor: "#EC4899", // Rose vif pour la pause
	mutedButton: "#2F3136",
};

export const useThemeColors = () => {
	const { effectiveScheme } = useSimpleTheme();
	return effectiveScheme === "dark" ? dark : light;
};
