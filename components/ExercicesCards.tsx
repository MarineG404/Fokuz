import { Exercise } from "@/assets/data/exercices";
import { COLORS } from "@/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const ExerciseCard = ({ exercise }: { exercise: Exercise }) => (
	<TouchableOpacity style={styles.card}>
		<Ionicons
			name={exercise.icon}
			size={40}
			color={COLORS.secondary}
			style={styles.icon}
		/>
		<View style={styles.textContainer}>
			<Text style={styles.name}>{exercise.name}</Text>
			<Text style={styles.description}>
				{exercise.workDuration} min de travail
				{exercise.breakDuration ? `, ${exercise.breakDuration} min de pause` : ""}
			</Text>
		</View>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	card: {
		backgroundColor: COLORS.cardBackground,
		borderRadius: 20,
		padding: 16,
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,

		// Ombre iOS
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,

		// Ombre Android
		elevation: 2,
	},
	icon: {
		marginRight: 16,
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
