import { useThemeColors } from "@/constants/color";
import SPACING from '@/constants/spacing';
import TYPOGRAPHY from '@/constants/typography';
import React from "react";
import { useTranslation } from "react-i18next";
import {
	Modal,
	StyleSheet,
	Text,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle
} from "react-native";
import BlockCard from "../ui/BlockCard";

interface ConfirmModalProps {
	visible: boolean;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
	visible,
	title,
	message,
	confirmText,
	cancelText,
	onConfirm,
	onCancel,
}) => {
	const COLORS = useThemeColors();
	const { t } = useTranslation();

	return (
		<Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onCancel}>
			<View style={styles.modalOverlay}>
				<BlockCard style={styles.modalContent}>
					<Text style={[styles.modalTitle, { color: COLORS.text }]}>{title}</Text>
					<Text style={[styles.modalMessage, { color: COLORS.textSecondary }]}>{message}</Text>

					<View style={styles.modalButtons}>
						<TouchableOpacity
							style={[
								styles.modalButton,
								styles.cancelButton,
								{ borderColor: COLORS.textSecondary },
							]}
							onPress={onCancel}
							accessibilityRole="button"
							accessibilityLabel={cancelText || t("MODAL.CONFIRM.CANCEL_BUTTON")}
						>
							<Text style={[styles.modalButtonText, { color: COLORS.textSecondary }]}>
								{cancelText || t("MODAL.CONFIRM.CANCEL_BUTTON")}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.modalButton,
								styles.confirmButton,
								{ backgroundColor: COLORS.primary },
							]}
							onPress={onConfirm}
							accessibilityRole="button"
							accessibilityLabel={confirmText || t("MODAL.CONFIRM.CONFIRM_BUTTON")}
						>
							<Text style={[styles.modalButtonText, { color: "white" }]}>
								{confirmText || t("MODAL.CONFIRM.CONFIRM_BUTTON")}
							</Text>
						</TouchableOpacity>
					</View>
				</BlockCard>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: SPACING.xl,
	} as ViewStyle,
	modalContent: {
		width: "100%",
		maxWidth: 320,
	} as ViewStyle,
	modalTitle: {
		fontSize: TYPOGRAPHY.sizes.md,
		fontWeight: TYPOGRAPHY.weights.semibold,
		textAlign: "center",
		marginBottom: 12,
	} as TextStyle,
	modalMessage: {
		fontSize: TYPOGRAPHY.sizes.base,
		textAlign: "center",
		lineHeight: TYPOGRAPHY.lineHeights.md,
		marginBottom: 24,
	} as TextStyle,
	modalButtons: {
		flexDirection: "row",
		gap: SPACING.md,
		justifyContent: "center",
	} as ViewStyle,
	modalButton: {
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 8,
		minWidth: 100,
		alignItems: "center",
	} as ViewStyle,
	cancelButton: {
		borderWidth: 1,
	} as ViewStyle,
	confirmButton: {
		// backgroundColor défini dynamiquement
	} as ViewStyle,
	modalButtonText: {
		fontSize: TYPOGRAPHY.sizes.base,
		fontWeight: TYPOGRAPHY.weights.semibold,
	} as TextStyle,
});
