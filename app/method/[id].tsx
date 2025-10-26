import { LofiPlayer } from "@/components/media/LofiPlayer";
import { TimerComponent } from "@/components/timer/TimerComponent";
import BlockCard from "@/components/ui/BlockCard";
import { HeaderTitle } from "@/components/ui/HeaderTitle";
import { useThemeColors } from "@/constants/color";
import { useAllMethods } from "@/hooks/useAllMethods";
import { useCustomMethods } from "@/hooks/useCustomMethods";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
	useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MethodDetails() {
	const { updateCustomMethod } = useCustomMethods();
	const [editDescModalVisible, setEditDescModalVisible] = React.useState(false);
	const [descDraft, setDescDraft] = React.useState("");
	React.useEffect(() => {
		// allow rotation for this screen
		ScreenOrientation.unlockAsync().catch(() => {});

		return () => {
			// restore portrait lock when leaving
			ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
		};
	}, []);

	const params = useLocalSearchParams();
	const id = params.id as string | undefined;
	const COLORS = useThemeColors();
	const { width, height } = useWindowDimensions();
	const { getMethodById, loading } = useAllMethods();

	const method = getMethodById(id || "");

	const { t } = useTranslation();

	// read lofi enabled flag to avoid rendering an empty BlockCard in landscape
	const [lofiEnabled, setLofiEnabled] = React.useState<boolean | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const raw = await AsyncStorage.getItem("@fokuz:lofi_enabled");
				setLofiEnabled(raw === null ? true : raw === "true");
			} catch (e) {
				setLofiEnabled(true);
			}
		})();
	}, []);

	if (loading) {
		return (
			<SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
				<HeaderTitle title={t("METHOD.LOADING")} showBack />
			</SafeAreaView>
		);
	}

	if (!method) {
		return (
			<SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
				<HeaderTitle title={t("METHOD.NOT_FOUND")} showBack />
				<ScrollView style={styles.content}>
					<BlockCard padded={false}>
						<Text style={[styles.errorText, { color: COLORS.textSecondary }]}>
							{t("METHOD.NOT_FOUND_ID", { id })}
						</Text>
					</BlockCard>
				</ScrollView>
			</SafeAreaView>
		);
	}

	const renderLofiAndTimer = () => {
		const isLandscape = width > height;
		const lofiIsEnabled = lofiEnabled === null ? true : lofiEnabled;
		if (isLandscape) {
			// If lofi player is disabled, show only the timer in landscape (no empty left column)
			if (!lofiIsEnabled) {
				return (
					<BlockCard>
						<TimerComponent
							workDurationMinutes={method.workDuration}
							breakDurationMinutes={method.breakDuration}
							methodName={
								"translationKey" in method
									? t(`METHODS.${method.translationKey}.NAME`)
									: method.name
							}
							methodId={method.id}
						/>
					</BlockCard>
				);
			}

			return (
				<View style={styles.landscapeRow}>
					<View style={styles.landscapeHalf}>
						<BlockCard style={styles.cardFill}>
							<LofiPlayer />
						</BlockCard>
					</View>
					<View style={styles.landscapeHalf}>
						<BlockCard style={styles.cardFill}>
							<TimerComponent
								workDurationMinutes={method.workDuration}
								breakDurationMinutes={method.breakDuration}
								methodName={
									"translationKey" in method
										? t(`METHODS.${method.translationKey}.NAME`)
										: method.name
								}
								methodId={method.id}
							/>
						</BlockCard>
					</View>
				</View>
			);
		}
		return (
			<>
				{/* Portrait: stacked */}
				<LofiPlayer />
				<BlockCard>
					<TimerComponent
						workDurationMinutes={method.workDuration}
						breakDurationMinutes={method.breakDuration}
						methodName={
							"translationKey" in method ? t(`METHODS.${method.translationKey}.NAME`) : method.name
						}
						methodId={method.id}
					/>
				</BlockCard>
			</>
		);
	};

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
			<HeaderTitle
				title={
					"translationKey" in method ? t(`METHODS.${method.translationKey}.NAME`) : method.name
				}
				showBack
			/>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<>
					{/* Description Card */}
					<BlockCard>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							{/* Description */}
							<View style={{ flex: 1 }}>
								{(() => {
									const desc =
										"translationKey" in method
											? t(`METHODS.${method.translationKey}.DESCRIPTION`)
											: method.description;
									const isEmpty = !desc || desc === t("METHOD.NO_DESCRIPTION");
									return (
										<Text
											style={[
												styles.description,
												isEmpty
													? { color: COLORS.textSecondary, fontStyle: "italic" }
													: { color: COLORS.text },
											]}
										>
											{isEmpty ? t("METHOD.NO_DESCRIPTION") : desc}
										</Text>
									);
								})()}
							</View>
							{method.id.startsWith("custom_") && (
								<Pressable
									onPress={() => {
										setDescDraft(method.description || "");
										setEditDescModalVisible(true);
									}}
									style={{ marginLeft: 8, padding: 4 }}
									hitSlop={8}
								>
									<Ionicons name="pencil-outline" size={20} color={COLORS.textSecondary} />
								</Pressable>
							)}
						</View>
					</BlockCard>

					{/* Duration Info Card */}
					<BlockCard>
						<Text style={[styles.cardTitle, { color: COLORS.primary }]}>
							{t("METHOD.CONFIGURATION")}
						</Text>
						<View style={styles.durationRow}>
							<View style={[styles.durationItem, { borderLeftColor: COLORS.workColor }]}>
								<Text style={[styles.durationLabel, { color: COLORS.textSecondary }]}>
									{t("METHOD.WORK")}
								</Text>
								<Text style={[styles.durationValue, { color: COLORS.text }]}>
									{t("METHOD.WORK_DURATION", { duration: method.workDuration })}
								</Text>
							</View>
							{method.breakDuration && (
								<View style={[styles.durationItem, { borderLeftColor: COLORS.breakColor }]}>
									<Text style={[styles.durationLabel, { color: COLORS.textSecondary }]}>
										{t("METHOD.BREAK")}
									</Text>
									<Text style={[styles.durationValue, { color: COLORS.text }]}>
										{t("METHOD.BREAK_DURATION", { duration: method.breakDuration })}
									</Text>
								</View>
							)}
						</View>
					</BlockCard>

					{/* Lofi + Timer: stacked on portrait, side-by-side on landscape */}
					{/* useWindowDimensions must be called unconditionally at component top-level */}
					{renderLofiAndTimer()}
				</>
			</ScrollView>

			{/* Modal édition description */}
			<Modal
				visible={editDescModalVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setEditDescModalVisible(false)}
			>
				<Pressable style={styles.modalOverlay} onPress={() => setEditDescModalVisible(false)}>
					<Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
						<BlockCard style={styles.modalCard}>
							<View style={styles.modalHeader}>
								<Ionicons name="create-outline" size={20} color={COLORS.primary} />
								<Text style={[styles.modalTitle, { color: COLORS.text }]}>
									{t("EDIT_METHOD.DESCRIPTION_LABEL")}
								</Text>
							</View>

							<TextInput
								style={[
									styles.textArea,
									{
										borderColor: COLORS.border,
										color: COLORS.text,
										backgroundColor: COLORS.background,
									},
								]}
								value={descDraft}
								onChangeText={setDescDraft}
								placeholder={t("EDIT_METHOD.DESCRIPTION_PLACEHOLDER")}
								placeholderTextColor={COLORS.textSecondary}
								multiline
								numberOfLines={4}
								textAlignVertical="top"
							/>

							<View style={styles.modalButtons}>
								<Pressable
									onPress={() => setEditDescModalVisible(false)}
									style={[
										styles.button,
										styles.buttonCancel,
										{ backgroundColor: COLORS.background },
									]}
								>
									<Text style={[styles.buttonText, { color: COLORS.text }]}>
										{t("EDIT_METHOD.CANCEL")}
									</Text>
								</Pressable>
								<Pressable
									onPress={async () => {
										await updateCustomMethod({ ...method, description: descDraft });
										setEditDescModalVisible(false);
									}}
									style={[styles.button, styles.buttonSave, { backgroundColor: COLORS.primary }]}
								>
									<Ionicons name="checkmark" size={18} color="#fff" style={{ marginRight: 4 }} />
									<Text style={[styles.buttonText, styles.buttonTextSave]}>
										{t("EDIT_METHOD.SAVE")}
									</Text>
								</Pressable>
							</View>
						</BlockCard>
					</Pressable>
				</Pressable>
			</Modal>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	content: {
		flex: 1,
		paddingTop: 8,
	},
	description: {
		fontSize: 16,
		lineHeight: 24,
		textAlign: "center",
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 16,
		textAlign: "center",
	},
	durationRow: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	durationItem: {
		alignItems: "center",
		paddingLeft: 16,
		borderLeftWidth: 4,
		flex: 1,
		marginHorizontal: 8,
	},
	durationLabel: {
		fontSize: 14,
		fontWeight: "500",
		marginBottom: 4,
	},
	durationValue: {
		fontSize: 20,
		fontWeight: "bold",
	},
	landscapeRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		gap: 16,
		marginBottom: 16,
	},
	landscapeHalf: {
		flex: 1,
		minHeight: 300,
		marginHorizontal: 8,
	},
	cardFill: {
		flex: 1,
		paddingVertical: 12,
		justifyContent: "center",
	},
	errorText: {
		fontSize: 16,
		textAlign: "center",
	},
	// Modal styles
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	modalContent: {
		width: "100%",
		maxWidth: 500,
	},
	modalCard: {
		marginBottom: 0,
	},
	modalHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginLeft: 8,
	},
	textArea: {
		borderWidth: 1,
		borderRadius: 12,
		padding: 14,
		fontSize: 16,
		minHeight: 120,
		marginBottom: 20,
	},
	modalButtons: {
		flexDirection: "row",
		gap: 12,
		justifyContent: "flex-end",
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 10,
		minWidth: 100,
	},
	buttonCancel: {
		borderWidth: 1,
		borderColor: "rgba(0, 0, 0, 0.1)",
	},
	buttonSave: {
		flex: 1,
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "600",
	},
	buttonTextSave: {
		color: "#fff",
	},
});
