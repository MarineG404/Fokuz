import { useThemeColors } from "@/constants/color";
import SPACING from "@/constants/spacing";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
	Pressable,
	StyleSheet,
	ViewStyle,
	TextStyle
} from "react-native";

type FloatingActionButtonProps = {
	onPress: () => void;
	disabled?: boolean;
};

export function FloatingActionButton({ onPress, disabled = false }: FloatingActionButtonProps) {
	const COLORS = useThemeColors();
	const { t } = useTranslation();

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={t("METHOD.ADD")}
			onPress={disabled ? undefined : onPress}
			style={[
				styles.fab,
				{ backgroundColor: disabled ? COLORS.card : COLORS.primary, opacity: disabled ? 0.5 : 1 },
			]}
			android_ripple={{ color: "rgba(255, 255, 255, 0.3)" }}
			disabled={disabled}
		>
			<Ionicons name="add" size={32} color={disabled ? COLORS.textSecondary : "#FFFFFF"} />
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
		borderRadius: SPACING.radius['3xl'],
		alignItems: "center",
		justifyContent: "center",
		elevation: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
	},
});
