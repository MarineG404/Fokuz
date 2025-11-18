import { useSimpleTheme } from "@/contexts/SimpleTheme";

export const light = {
	primary: "#a000e1",
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
	primary: "#d18bff",
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

export const oled = {
	primary: "#d18bff",
	secondary: "#b29cff",
	background: "#000000", // Pure black pour OLED
	cardBackground: "#000000", // Pure black
	card: "#000000", // Pure black
	text: "#FFFFFF",
	textSecondary: "#999999",
	border: "#1A1A1A", // Gris très sombre
	workColor: "#4F46E5",
	breakColor: "#E11D48",
	mutedButton: "#1A1A1A",
};

export const useThemeColors = () => {
	const { effectiveScheme } = useSimpleTheme();
	if (effectiveScheme === "oled") return oled;
	return effectiveScheme === "dark" ? dark : light;
};
