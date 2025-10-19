import { useThemeColors } from "@/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

type FloatingActionButtonProps = {
	onPress: () => void;
};

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
	const COLORS = useThemeColors();

	return (
		<Pressable
			onPress={onPress}
			style={[styles.fab, { backgroundColor: COLORS.primary }]}
			android_ripple={{ color: "rgba(255, 255, 255, 0.3)" }}
		>
			<Ionicons name="add" size={32} color="#FFFFFF" />
		</Pressable>
	);
}

const styles = StyleSheet.create({
	fab: {
		position: "absolute",
		bottom: 24,
		right: 24,
		width: 64,
		height: 64,
		borderRadius: 32,
		alignItems: "center",
		justifyContent: "center",
		elevation: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
	},
});
