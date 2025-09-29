import { Ionicons } from "@expo/vector-icons";

export type Exercise = {
	id: string;
	name: string;
	workDuration: number;
	breakDuration?: number;
	icon: keyof typeof Ionicons.glyphMap;
};

export const exercises: Exercise[] = [
	{
		id: "1",
		name: "Pomodoro",
		workDuration: 25,
		breakDuration: 5,
		icon: "repeat-outline",
	},
	{
		id: "2",
		name: "Deep Work",
		workDuration: 90,
		icon: "briefcase-outline",
	},
	{
		id: "3",
		name: "Méthode 52/17",
		workDuration: 52,
		breakDuration: 17,
		icon: "hourglass-outline",
	},
];
