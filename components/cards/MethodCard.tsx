import { Method } from "@/assets/data/methods";
import { useThemeColors } from "@/constants/color";
import SPACING from "@/constants/spacing";
import TYPOGRAPHY from "@/constants/typography";
import { useCustomMethods } from "@/hooks/useCustomMethods";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Alert,
	Pressable,
	StyleSheet,
	Text,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from "react-native";
import { EditMethodModal } from "../modals/EditMethodModal";
import BlockCard from "../ui/BlockCard";

export const MethodCard = ({
	method,
	disabled = false,
	onPress,
}: {
	method: Method;
	disabled?: boolean;
	onPress?: () => void;
}) => {
	const COLORS = useThemeColors();
	const router = useRouter();
	const { t } = useTranslation();
	const { updateCustomMethod, deleteCustomMethod } = useCustomMethods();
	const [editModalVisible, setEditModalVisible] = useState(false);

	const isCustomMethod = method.id.startsWith("custom_");

	const handlePress = () => {
		console.log("CLICK MethodCard", method.name, "disabled:", disabled);
		if (disabled) return;
		if (onPress) return onPress();
		onPressDefault();
	};

	const onPressDefault = () => {
		router.push(`/method/${method.id}` as any);
	};

	const handleEdit = () => {
		if (disabled) return;
		setEditModalVisible(true);
	};

	const handleDelete = () => {
		if (disabled) return;
		Alert.alert(
			t("EDIT_METHOD.DELETE.TITLE"),
			t("EDIT_METHOD.DELETE.MESSAGE", { name: method.name }),
			[
				{
					text: t("MODAL.CONFIRM.CANCEL_BUTTON"),
					style: "cancel",
				},
				{
					text: t("MODAL.CONFIRM.CONFIRM_BUTTON"),
					style: "destructive",
					onPress: async () => {
						await deleteCustomMethod(method.id);
					},
				},
			],
		);
	};

	function handleUpdate(updatedMethod: Method): void {
		updateCustomMethod(updatedMethod);
		setEditModalVisible(false);
	}

	return (
		<TouchableOpacity
			onPress={handlePress}
			disabled={disabled}
			activeOpacity={disabled ? 1 : 0.7}
			accessibilityRole="button"
			accessibilityLabel={method.name}
			accessibilityState={{ disabled }}
		>
			<BlockCard style={[styles.card, disabled && styles.cardDisabled]}>
				<Ionicons
					name={method.icon}
					size={40}
					color={disabled ? COLORS.textSecondary : COLORS.secondary}
					style={[styles.icon, disabled && styles.iconDisabled]}
					accessible={false}
				/>
				<View style={styles.textContainer}>
					<Text style={[styles.name, { color: disabled ? COLORS.textSecondary : COLORS.text }]}>
						{method.name}
					</Text>
					<Text style={[styles.description, { color: COLORS.textSecondary }]}>
						{t("DURATION.WORK", { duration: method.workDuration })}
						{method.breakDuration && t("DURATION.BREAK", { duration: method.breakDuration })}
					</Text>
				</View>
				{isCustomMethod && (
					<View style={styles.actionsContainer}>
						<Pressable
							accessibilityRole="button"
							accessibilityLabel={t("METHOD.EDIT")}
							onPress={handleEdit}
							disabled={disabled}
							style={[
								styles.actionButton,
								{ backgroundColor: COLORS.mutedButton },
								disabled && styles.actionButtonDisabled,
							]}
							hitSlop={8}
						>
							<Ionicons
								name="pencil-outline"
								size={20}
								color={COLORS.textSecondary}
								accessible={false}
							/>
						</Pressable>
						<Pressable
							accessibilityRole="button"
							accessibilityLabel={t("METHOD.DELETE")}
							onPress={handleDelete}
							disabled={disabled}
							style={[
								styles.actionButton,
								{ backgroundColor: COLORS.mutedButton },
								disabled && styles.actionButtonDisabled,
							]}
							hitSlop={8}
						>
							<Ionicons
								name="trash-outline"
								size={20}
								color={COLORS.textSecondary}
								accessible={false}
							/>
						</Pressable>
					</View>
				)}
				{disabled && <View style={styles.disabledOverlay} />}
			</BlockCard>
			{isCustomMethod && (
				<EditMethodModal
					visible={editModalVisible}
					onClose={() => setEditModalVisible(false)}
					onUpdate={handleUpdate}
					method={method}
				/>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
		position: "relative",
	} as ViewStyle,
	cardDisabled: {
		opacity: 0.5,
	} as ViewStyle,
	icon: {
		marginRight: 16,
	} as TextStyle,
	iconDisabled: {
		opacity: 0.5,
	} as TextStyle,
	textContainer: {
		flex: 1,
	} as ViewStyle,
	name: {
		fontSize: TYPOGRAPHY.sizes.md,
		fontWeight: TYPOGRAPHY.weights.semibold,
		marginBottom: 4,
	} as TextStyle,
	description: {
		fontSize: TYPOGRAPHY.sizes.sm,
	} as TextStyle,
	actionsContainer: {
		flexDirection: "row",
		gap: SPACING.sm,
	} as ViewStyle,
	actionButton: {
		width: 44,
		height: 44,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
	} as ViewStyle,
	actionButtonDisabled: {
		opacity: 0.5,
	} as ViewStyle,
	disabledOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "transparent",
	} as ViewStyle,
});

export default MethodCard;
