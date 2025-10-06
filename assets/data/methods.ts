import { Ionicons } from "@expo/vector-icons";

export type Method = {
	id: string;
	name: string;
	description: string;
	workDuration: number;
	breakDuration?: number;
	icon: keyof typeof Ionicons.glyphMap;
};

export const methods: Method[] = [
	{
		id: "1",
		name: "Pomodoro",
		description: "Travaillez en intervalles de 25 minutes avec des pauses de 5 minutes.",
		workDuration: 25,
		breakDuration: 5,
		icon: "repeat-outline",
	},
	{
		id: "2",
		name: "Deep Work",
		description: "Concentrez-vous intensément pendant 90 minutes pour un travail en profondeur.",
		workDuration: 90,
		icon: "briefcase-outline",
	},
	{
		id: "3",
		name: "Méthode 52/17",
		description: "Travaillez pendant 52 minutes, puis faites une pause de 17 minutes.",
		workDuration: 52,
		breakDuration: 17,
		icon: "hourglass-outline",
	},
];
