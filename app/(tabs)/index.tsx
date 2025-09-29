import { exercises } from "@/assets/data/exercices";
import { ExerciseCard } from "@/components/ExercicesCards";
import { COLORS } from "@/constants/color";
import { FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>🎯 Choisis ta méthode</Text>
			<FlatList
				data={exercises}
				renderItem={({ item }) => <ExerciseCard exercise={item} />}
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
		paddingHorizontal: 16,
		paddingTop: 16,
		backgroundColor: COLORS.background,
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
});
