import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Exercise = {
	id: string;
	name: string;
	description: string;
	image: string;
};

const exercises: Exercise[] = [
	{
		id: "1",
		name: "Pomodoro",
		description: "25 min de travail, 5 min de pause",
		image: "",
	},
	{
		id: "2",
		name: "Deep Work",
		description: "90 min de focus sans interruption",
		image: "",
	},
	{
		id: "3",
		name: "Méthode 52/17",
		description: "52 min de travail, 17 min de pause",
		image: "",
	},
];

export default function HomeScreen() {
	const renderExercise = ({ item }: { item: Exercise }) => (
		<TouchableOpacity style={styles.card} activeOpacity={0.8}>
			<Image source={{ uri: item.image }} style={styles.image} />
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F5F7",
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "700",
		color: "#a000e1",
		marginBottom: 20,
		textAlign: "center",
	},
	list: {
		paddingBottom: 20,
	},
	card: {
		backgroundColor: "#fff",
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
	image: {
		width: 48,
		height: 48,
		marginRight: 16,
		tintColor: "#b29cff"
	},
	textContainer: {
		flex: 1,
	},
	name: {
		fontSize: 18,
		fontWeight: "600",
		color: "#000", // noir
		marginBottom: 4,
	},
	description: {
		fontSize: 14,
		color: "#444",
	},
});

