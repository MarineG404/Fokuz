import { Method } from "@/assets/data/methods";
import { useThemeColors } from "@/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BlockCard from "../ui/BlockCard";

export const MethodCard = ({ method }: { method: Method }) => {
	const COLORS = useThemeColors();
	const router = useRouter();

	const onPress = () => {
		router.push(`/method/${method.id}` as any);
	};

	return (
		<TouchableOpacity onPress={onPress}>
			<BlockCard style={styles.card}>
				<Ionicons name={method.icon} size={40} color={COLORS.secondary} style={styles.icon} />
				<View style={styles.textContainer}>
					<Text style={[styles.name, { color: COLORS.text }]}>{method.name}</Text>
					<Text style={[styles.description, { color: COLORS.textSecondary }]}>
						{method.workDuration} min de travail
						{method.breakDuration ? `, ${method.breakDuration} min de pause` : ""}
					</Text>
				</View>
			</BlockCard>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	icon: { marginRight: 16 },
	textContainer: { flex: 1 },
	name: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
	description: { fontSize: 14 },
});

export default MethodCard;
