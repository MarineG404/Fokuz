import CategorySelector from "@/components/settings/CategorySelector";
import BlockCard from "@/components/ui/BlockCard";
import { useThemeColors } from "@/constants/color";
import { SPACING } from "@/constants/spacing";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, Text } from "react-native";

type Props = {
	visible: boolean;
	onClose: () => void;
};

export default function CategoriesModal({ visible, onClose }: Props) {
	const COLORS = useThemeColors();
	const { t } = useTranslation();

	return (
		<Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
			<Pressable style={styles.overlay} onPress={onClose}>
				<Pressable
					style={[styles.inner, { backgroundColor: COLORS.card }]}
					onPress={(e) => e.stopPropagation()}
				>
					<BlockCard>
						<Text style={[styles.title, { color: COLORS.text }]}>
							{t("PLAYER_SETTINGS.CATEGORIES")}
						</Text>

						<CategorySelector compact />

						<Pressable
							onPress={onClose}
							style={[styles.closeButton, { backgroundColor: COLORS.primary }]}
						>
							<Text style={styles.closeButtonText}>{t("MODAL.CONFIRM.CANCEL_BUTTON")}</Text>
						</Pressable>
					</BlockCard>
				</Pressable>
			</Pressable>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "flex-end",
	},
	inner: {
		maxHeight: "80%",
		width: "100%",
	},
	title: {
		fontSize: 20,
		fontWeight: "700",
		marginBottom: SPACING.large,
	},
	closeButton: {
		marginTop: SPACING.large,
		padding: SPACING.large,
		borderRadius: SPACING.radius,
		alignItems: "center",
	},
	closeButtonText: {
		color: "#fff",
		fontWeight: "600",
		fontSize: 16,
	},
});
