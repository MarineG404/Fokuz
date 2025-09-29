import { COLORS } from "@/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Exercise = {
	id: string;
	name: string;
	description: string;
	icon: keyof typeof Ionicons.glyphMap;
};

const exercises: Exercise[] = [
	{
		id: "1",
		name: "Pomodoro",
		description: "25 min de travail, 5 min de pause",
		icon: "repeat-outline",
	},
	{
		id: "2",
		name: "Deep Work",
		description: "90 min de focus sans interruption",
		icon: "briefcase-outline",
	},
	{
		id: "3",
		name: "Méthode 52/17",
		description: "52 min de travail, 17 min de pause",
		icon: "hourglass-outline",
	},
];

export default function HomeScreen() {
	const renderExercise = ({ item }: { item: Exercise }) => (
		<TouchableOpacity style={styles.card} activeOpacity={0.8}>
			<Ionicons
				name={item.icon}
				size={40}
				color={COLORS.secondary}
				style={styles.icon}
			/>
			<View style={styles.textContainer}>
				<Text style={styles.name}>{item.name}</Text>
				<Text style={styles.description}>{item.description}</Text>
			</View>
		</TouchableOpacity>
	);

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>🎯 Choisis ta méthode</Text>
			<FlatList
				data={exercises}
				renderItem={renderExercise}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
			/>
		</SafeAreaView>
	);
}

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "700",
		color: COLORS.primary,
		marginBottom: 20,
		textAlign: "center",
	},
	list: {
		paddingBottom: 20,
	},
	card: {
		backgroundColor: COLORS.cardBackground,
		borderRadius: 20,
		padding: 16,
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
		shadowColor: "#000",
		shadowOpacity: 0.08,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 6,
		elevation: 3,
	},
	icon: {
		marginRight: 16,
		color: COLORS.secondary,
	},
	textContainer: {
		flex: 1,
	},
	name: {
		fontSize: 18,
		fontWeight: "600",
		color: COLORS.text,
		marginBottom: 4,
	},
	description: {
		fontSize: 14,
		color: COLORS.textSecondary,
	},
});


