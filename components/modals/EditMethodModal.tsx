import type { Method } from "@/assets/data/methods";
import { useThemeColors } from "@/constants/color";
import SPACING from '@/constants/spacing';
import TYPOGRAPHY from '@/constants/typography';
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Alert,
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TextStyle,
	View,
	ViewStyle
} from "react-native";

type EditMethodModalProps = {
	visible: boolean;
	onClose: () => void;
	onUpdate: (method: Method) => void;
	method: Method;
};

const AVAILABLE_ICONS: (keyof typeof Ionicons.glyphMap)[] = [
	"repeat-outline",
	"briefcase-outline",
	"hourglass-outline",
	"timer-outline",
	"flash-outline",
	"rocket-outline",
	"star-outline",
	"flame-outline",
	"trophy-outline",
	"fitness-outline",
];

export function EditMethodModal({ visible, onClose, onUpdate, method }: EditMethodModalProps) {
	const COLORS = useThemeColors();
	const { t } = useTranslation();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [workDuration, setWorkDuration] = useState("");
	const [breakDuration, setBreakDuration] = useState("");
	const [selectedIcon, setSelectedIcon] = useState<keyof typeof Ionicons.glyphMap>("timer-outline");

	const ICON_LABEL_KEYS: Record<string, string> = {
		"repeat-outline": "MODAL.ADD_METHOD.ICON_NAMES.REPEAT",
		"briefcase-outline": "MODAL.ADD_METHOD.ICON_NAMES.BRIEFCASE",
		"hourglass-outline": "MODAL.ADD_METHOD.ICON_NAMES.HOURGLASS",
		"timer-outline": "MODAL.ADD_METHOD.ICON_NAMES.TIMER",
		"flash-outline": "MODAL.ADD_METHOD.ICON_NAMES.FLASH",
		"rocket-outline": "MODAL.ADD_METHOD.ICON_NAMES.ROCKET",
		"star-outline": "MODAL.ADD_METHOD.ICON_NAMES.STAR",
		"flame-outline": "MODAL.ADD_METHOD.ICON_NAMES.FLAME",
		"trophy-outline": "MODAL.ADD_METHOD.ICON_NAMES.TROPHY",
		"fitness-outline": "MODAL.ADD_METHOD.ICON_NAMES.FITNESS",
	};

	// Charger les valeurs de la méthode quand la modal s'ouvre
	useEffect(() => {
		if (visible && method) {
			setName(method.name);
			setDescription(method.description || "");
			setWorkDuration(method.workDuration.toString());
			setBreakDuration(method.breakDuration?.toString() || "");
			setSelectedIcon(method.icon);
		}
	}, [visible, method]);

	const handleUpdate = () => {
		if (!name.trim() || !workDuration.trim()) {
			Alert.alert(t("EDIT_METHOD.ERROR.TITLE", "Error"), t("EDIT_METHOD.ERROR.REQUIRED_FIELDS"));
			return;
		}

		const workMin = parseInt(workDuration);
		if (isNaN(workMin) || workMin <= 0) {
			Alert.alert(
				t("EDIT_METHOD.ERROR.TITLE", "Error"),
				t("EDIT_METHOD.ERROR.INVALID_WORK_DURATION"),
			);
			return;
		}

		const updatedMethod: Method = {
			...method,
			name: name.trim(),
			description: description.trim(),
			workDuration: workMin,
			icon: selectedIcon,
		};

		if (breakDuration.trim()) {
			const breakMin = parseInt(breakDuration);
			if (!isNaN(breakMin) && breakMin > 0) {
				updatedMethod.breakDuration = breakMin;
			} else {
				updatedMethod.breakDuration = undefined;
			}
		} else {
			updatedMethod.breakDuration = undefined;
		}

		onUpdate(updatedMethod);
		onClose();
	};

	return (
		<Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
			<View style={styles.overlay}>
				<View style={[styles.modalContainer, { backgroundColor: COLORS.background }]}>
					<View style={styles.header}>
						<Text style={[styles.title, { color: COLORS.text }]}>{t("EDIT_METHOD.TITLE")}</Text>
						<Pressable
							onPress={onClose}
							style={styles.closeButton}
							accessibilityRole="button"
							accessibilityLabel={t("MODAL.ADD_METHOD.CLOSE_BUTTON")}
						>
							<Ionicons name="close" size={24} color={COLORS.text} accessible={false} />
						</Pressable>
					</View>

					<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
						{/* Nom */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: COLORS.text }]}>
								{t("EDIT_METHOD.NAME_LABEL")}
							</Text>
							<TextInput
								style={[
									styles.input,
									{
										backgroundColor: COLORS.card,
										color: COLORS.text,
										borderColor: COLORS.border,
									},
								]}
								value={name}
								onChangeText={setName}
								placeholder={t("EDIT_METHOD.NAME_PLACEHOLDER")}
								placeholderTextColor={COLORS.textSecondary}
							/>
						</View>

						{/* Description */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: COLORS.text }]}>
								{t("EDIT_METHOD.DESCRIPTION_LABEL")}
							</Text>
							<TextInput
								style={[
									styles.input,
									styles.textArea,
									{
										backgroundColor: COLORS.card,
										color: COLORS.text,
										borderColor: COLORS.border,
									},
								]}
								value={description}
								onChangeText={setDescription}
								placeholder={t("EDIT_METHOD.DESCRIPTION_PLACEHOLDER")}
								placeholderTextColor={COLORS.textSecondary}
								multiline
								numberOfLines={3}
							/>
						</View>

						{/* Durée de travail */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: COLORS.text }]}>
								{t("EDIT_METHOD.WORK_DURATION_LABEL")}
							</Text>
							<TextInput
								style={[
									styles.input,
									{
										backgroundColor: COLORS.card,
										color: COLORS.text,
										borderColor: COLORS.border,
									},
								]}
								value={workDuration}
								onChangeText={setWorkDuration}
								placeholder="25"
								placeholderTextColor={COLORS.textSecondary}
								keyboardType="number-pad"
							/>
						</View>

						{/* Durée de pause */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: COLORS.textSecondary }]}>
								{t("EDIT_METHOD.BREAK_DURATION_LABEL")}
							</Text>
							<TextInput
								style={[
									styles.input,
									{
										backgroundColor: COLORS.card,
										color: COLORS.text,
										borderColor: COLORS.border,
									},
								]}
								value={breakDuration}
								onChangeText={setBreakDuration}
								placeholder="5"
								placeholderTextColor={COLORS.textSecondary}
								keyboardType="number-pad"
							/>
						</View>

						{/* Sélection d'icône */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: COLORS.text }]}>
								{t("EDIT_METHOD.ICON_LABEL")}
							</Text>
							<View style={styles.iconGrid}>
								{AVAILABLE_ICONS.map((icon) => (
									<Pressable
										key={icon}
										onPress={() => setSelectedIcon(icon)}
										style={[
											styles.iconButton,
											{
												backgroundColor: selectedIcon === icon ? COLORS.primary : COLORS.card,
												borderColor: selectedIcon === icon ? COLORS.primary : COLORS.border,
											},
										]}
										accessibilityRole="button"
										accessibilityLabel={t(ICON_LABEL_KEYS[icon] || "MODAL.ADD_METHOD.ICON_LABEL")}
										accessibilityState={{ selected: selectedIcon === icon }}
									>
										<Ionicons
											name={icon}
											size={28}
											color={selectedIcon === icon ? "#FFFFFF" : COLORS.text}
											accessible={false}
										/>
									</Pressable>
								))}
							</View>
						</View>
					</ScrollView>

					{/* Boutons d'action */}
					<View style={styles.footer}>
						<Pressable
							onPress={onClose}
							style={[styles.button, { backgroundColor: COLORS.card }]}
							accessibilityRole="button"
							accessibilityLabel={t("EDIT_METHOD.CANCEL")}
						>
							<Text style={[styles.buttonText, { color: COLORS.text }]}>
								{t("EDIT_METHOD.CANCEL")}
							</Text>
						</Pressable>
						<Pressable
							onPress={handleUpdate}
							style={[styles.button, { backgroundColor: COLORS.primary }]}
							accessibilityRole="button"
							accessibilityLabel={t("EDIT_METHOD.SAVE")}
						>
							<Text style={[styles.buttonText, { color: "#FFFFFF" }]}>{t("EDIT_METHOD.SAVE")}</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "flex-end",
	} as ViewStyle,
	modalContainer: {
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		maxHeight: "90%",
		paddingTop: 16,
	} as ViewStyle,
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingBottom: 16,
	} as ViewStyle,
	title: {
		fontSize: TYPOGRAPHY.sizes.lg,
		fontWeight: TYPOGRAPHY.weights.bold,
	} as TextStyle,
	closeButton: {
		width: 44,
		height: 44,
		alignItems: "center",
		justifyContent: "center",
		padding: SPACING.sm,
	} as ViewStyle,
	content: {
		paddingHorizontal: 20,
		marginBottom: 16,
	} as ViewStyle,
	inputGroup: {
		marginBottom: 20,
	} as ViewStyle,
	label: {
		fontSize: TYPOGRAPHY.sizes.sm,
		fontWeight: TYPOGRAPHY.weights.semibold,
		marginBottom: 8,
	} as TextStyle,
	input: {
		borderWidth: 1,
		borderRadius: 12,
		padding: SPACING.padding.md,
		fontSize: TYPOGRAPHY.sizes.base,
	} as TextStyle,
	textArea: {
		minHeight: 80,
		textAlignVertical: "top",
	} as TextStyle,
	iconGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: SPACING.md,
	} as ViewStyle,
	iconButton: {
		width: 56,
		height: 56,
		borderRadius: 12,
		borderWidth: 2,
		alignItems: "center",
		justifyContent: "center",
	} as ViewStyle,
	footer: {
		flexDirection: "row",
		gap: SPACING.md,
		paddingHorizontal: 20,
		paddingBottom: 20,
		paddingTop: 12,
	} as ViewStyle,
	button: {
		flex: 1,
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: "center",
	} as ViewStyle,
	buttonText: {
		fontSize: TYPOGRAPHY.sizes.base,
		fontWeight: TYPOGRAPHY.weights.semibold,
	} as TextStyle,
});
