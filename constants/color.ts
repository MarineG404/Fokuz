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
	workColor: "#3B82F6", // Bleu vif et énergique pour le travail
	breakColor: "#10B981", // Vert apaisant pour la pause
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
	workColor: "#60A5FA", // Bleu clair et dynamique pour le travail
	breakColor: "#34D399", // Vert menthe relaxant pour la pause
	mutedButton: "#2F3136",
};

export const useThemeColors = () => {
	const { effectiveScheme } = useSimpleTheme();
	return effectiveScheme === "dark" ? dark : light;
};
