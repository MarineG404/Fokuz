import { useThemeColors } from '@/constants/color';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
	confirmText = 'Confirmer',
	cancelText = 'Annuler',
	onConfirm,
	onCancel,
}) => {
	const COLORS = useThemeColors();

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={visible}
			onRequestClose={onCancel}
		>
			<View style={styles.modalOverlay}>
				<View style={[styles.modalContent, { backgroundColor: COLORS.cardBackground }]}>
					<Text style={[styles.modalTitle, { color: COLORS.text }]}>
						{title}
					</Text>
					<Text style={[styles.modalMessage, { color: COLORS.textSecondary }]}>
						{message}
					</Text>

					<View style={styles.modalButtons}>
						<TouchableOpacity
							style={[styles.modalButton, styles.cancelButton, { borderColor: COLORS.textSecondary }]}
							onPress={onCancel}
						>
							<Text style={[styles.modalButtonText, { color: COLORS.textSecondary }]}>
								{cancelText}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.modalButton, styles.confirmButton, { backgroundColor: COLORS.primary }]}
							onPress={onConfirm}
						>
							<Text style={[styles.modalButtonText, { color: 'white' }]}>
								{confirmText}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	modalContent: {
		borderRadius: 16,
		padding: 24,
		width: '100%',
		maxWidth: 320,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 12,
		elevation: 8,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '600',
		textAlign: 'center',
		marginBottom: 12,
	},
	modalMessage: {
		fontSize: 16,
		textAlign: 'center',
		lineHeight: 22,
		marginBottom: 24,
	},
	modalButtons: {
		flexDirection: 'row',
		gap: 12,
		justifyContent: 'center',
	},
	modalButton: {
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 8,
		minWidth: 100,
		alignItems: 'center',
	},
	cancelButton: {
		backgroundColor: 'transparent',
		borderWidth: 1,
	},
	confirmButton: {
		// backgroundColor défini dynamiquement
	},
	modalButtonText: {
		fontSize: 16,
		fontWeight: '600',
	},
});
