import { Method } from "@/assets/data/methods";
import { useThemeColors } from "@/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const MethodCard = ({ method }: { method: Method }) => {
	const COLORS = useThemeColors();
	const router = useRouter();

	const onPress = () => {
		router.push((`/method/${method.id}` as any));
	};

	return (
		<TouchableOpacity
			onPress={onPress}
			style={[styles.card, { backgroundColor: COLORS.cardBackground }]}
		>
			<Ionicons name={method.icon} size={40} color={COLORS.secondary} style={styles.icon} />
			<View style={styles.textContainer}>
				<Text style={[styles.name, { color: COLORS.text }]}>{method.name}</Text>
				<Text style={[styles.description, { color: COLORS.textSecondary }]}>
					{method.workDuration} min de travail
					{method.breakDuration ? `, ${method.breakDuration} min de pause` : ""}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: "transparent",
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
		marginBottom: 4,
	},
	description: {
		fontSize: 14,
	},
});
