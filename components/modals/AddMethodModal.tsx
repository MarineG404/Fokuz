import type { Method } from "@/assets/data/methods";
import { useThemeColors } from "@/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Alert,
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";

type AddMethodModalProps = {
	visible: boolean;
	onClose: () => void;
	onAdd: (method: Omit<Method, "id">) => void;
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

export function AddMethodModal({ visible, onClose, onAdd }: AddMethodModalProps) {
	const COLORS = useThemeColors();
	const { t } = useTranslation();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [workDuration, setWorkDuration] = useState("");
	const [breakDuration, setBreakDuration] = useState("");
	const [selectedIcon, setSelectedIcon] = useState<keyof typeof Ionicons.glyphMap>("timer-outline");

	const resetForm = () => {
		setName("");
		setDescription("");
		setWorkDuration("");
		setBreakDuration("");
		setSelectedIcon("timer-outline");
	};

	const handleAdd = () => {
		if (!name.trim() || !workDuration.trim()) {
			Alert.alert(
				t("MODAL.ADD_METHOD.ERROR.TITLE"),
				t("MODAL.ADD_METHOD.ERROR.REQUIRED_FIELDS")
			);
			return;
		}

		const workMin = parseInt(workDuration);
		if (isNaN(workMin) || workMin <= 0) {
			Alert.alert(
				t("MODAL.ADD_METHOD.ERROR.TITLE"),
				t("MODAL.ADD_METHOD.ERROR.INVALID_WORK_DURATION")
			);
			return;
		}

		const newMethod: Omit<Method, "id"> = {
			name: name.trim(),
			description: description.trim(),
			workDuration: workMin,
			icon: selectedIcon,
		};

		if (breakDuration.trim()) {
			const breakMin = parseInt(breakDuration);
			if (!isNaN(breakMin) && breakMin > 0) {
				newMethod.breakDuration = breakMin;
			}
		}

		onAdd(newMethod);
		resetForm();
		onClose();
	};

	return (
		<Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
			<View style={styles.overlay}>
				<View style={[styles.modalContainer, { backgroundColor: COLORS.background }]}>
					<View style={styles.header}>
						<Text style={[styles.title, { color: COLORS.text }]}>
							{t("MODAL.ADD_METHOD.TITLE")}
						</Text>
						<Pressable onPress={onClose} style={styles.closeButton}>
							<Ionicons name="close" size={24} color={COLORS.text} />
						</Pressable>
					</View>

					<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
						{/* Nom */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: COLORS.text }]}>
								{t("MODAL.ADD_METHOD.NAME_LABEL")}
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
								placeholder={t("MODAL.ADD_METHOD.NAME_PLACEHOLDER")}
								placeholderTextColor={COLORS.textSecondary}
							/>
						</View>

						{/* Description */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: COLORS.text }]}>
								{t("MODAL.ADD_METHOD.DESCRIPTION_LABEL")}
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
								placeholder={t("MODAL.ADD_METHOD.DESCRIPTION_PLACEHOLDER")}
								placeholderTextColor={COLORS.textSecondary}
								multiline
								numberOfLines={3}
							/>
						</View>

						{/* Durée de travail */}
						<View style={styles.inputGroup}>
							<Text style={[styles.label, { color: COLORS.text }]}>
								{t("MODAL.ADD_METHOD.WORK_DURATION_LABEL")}
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
								{t("MODAL.ADD_METHOD.BREAK_DURATION_LABEL")}
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
								{t("MODAL.ADD_METHOD.ICON_LABEL")}
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
									>
										<Ionicons
											name={icon}
											size={28}
											color={selectedIcon === icon ? "#FFFFFF" : COLORS.text}
										/>
									</Pressable>
								))}
							</View>
						</View>
					</ScrollView>

					{/* Boutons d'action */}
					<View style={styles.footer}>
						<Pressable onPress={onClose} style={[styles.button, { backgroundColor: COLORS.card }]}>
							<Text style={[styles.buttonText, { color: COLORS.text }]}>
								{t("MODAL.ADD_METHOD.CANCEL_BUTTON")}
							</Text>
						</Pressable>
						<Pressable
							onPress={handleAdd}
							style={[styles.button, { backgroundColor: COLORS.primary }]}
						>
							<Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
								{t("MODAL.ADD_METHOD.ADD_BUTTON")}
							</Text>
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
	},
	modalContainer: {
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		maxHeight: "90%",
		paddingTop: 16,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingBottom: 16,
	},
	title: {
		fontSize: 22,
		fontWeight: "700",
	},
	closeButton: {
		padding: 4,
	},
	content: {
		paddingHorizontal: 20,
		marginBottom: 16,
	},
	inputGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		marginBottom: 8,
	},
	input: {
		borderWidth: 1,
		borderRadius: 12,
		padding: 14,
		fontSize: 16,
	},
	textArea: {
		minHeight: 80,
		textAlignVertical: "top",
	},
	iconGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
	},
	iconButton: {
		width: 56,
		height: 56,
		borderRadius: 12,
		borderWidth: 2,
		alignItems: "center",
		justifyContent: "center",
	},
	footer: {
		flexDirection: "row",
		gap: 12,
		paddingHorizontal: 20,
		paddingBottom: 20,
		paddingTop: 12,
	},
	button: {
		flex: 1,
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: "center",
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "600",
	},
});
