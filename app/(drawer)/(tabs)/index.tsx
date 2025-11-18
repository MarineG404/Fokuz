import type { Method } from "@/assets/data/methods";
import { MethodCard } from "@/components/cards/MethodCard";
import { AddMethodModal } from "@/components/modals/AddMethodModal";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { HeaderTitle } from "@/components/ui/HeaderTitle";
import { useThemeColors } from "@/constants/color";
import SPACING from "@/constants/spacing";
import TYPOGRAPHY from "@/constants/typography";
import { useTimerContext } from "@/contexts/TimerContext";
import { useAllMethods } from "@/hooks/useAllMethods";
import { useCustomMethods } from "@/hooks/useCustomMethods";
import { useTimerDisplay } from "@/hooks/useTimerDisplay";

import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Alert,
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	TextStyle,
	View,
	ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
	const router = useRouter();
	const COLORS = useThemeColors();
	const { allMethods } = useAllMethods();
	const { addCustomMethod } = useCustomMethods();
	const [modalVisible, setModalVisible] = useState(false);
	const { timerState, clearTimerState, saveCurrentSession } = useTimerContext();
	const { timerDisplay, hasActiveSession, refresh } = useTimerDisplay();
	const { t } = useTranslation();

	// Refresh on focus
	useFocusEffect(
		useCallback(() => {
			refresh();
		}, [refresh]),
	);

	const handleAddMethod = async (method: Omit<Method, "id">) => {
		await addCustomMethod(method);
	};

	const handleMethodPress = (method: Method) => {
		if (hasActiveSession) {
			Alert.alert(t("TIMER.TITLE"), t("TIMER.SESSION_IN_PROGRESS"));
			return;
		}
		if (method && method.id) {
			router.push(`/method/${method.id}`);
		}
	};

	const handleViewSession = () => {
		if (timerDisplay?.methodId) {
			router.push(`/method/${timerDisplay.methodId}` as any);
		}
	};

	const handleStopSession = () => {
		Alert.alert(t("TIMER.STOP_CONFIRM_TITLE"), t("TIMER.STOP_CONFIRM_MESSAGE"), [
			{
				text: t("MODAL.CONFIRM.CANCEL_BUTTON"),
				style: "cancel",
			},
			{
				text: t("MODAL.CONFIRM.CONFIRM_BUTTON"),
				style: "destructive",
				onPress: async () => {
					await saveCurrentSession(false);
					await clearTimerState();
				},
			},
		]);
	};

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
			<HeaderTitle title={t("CHOOSE_METHOD")} showDrawer />

			{/* Bloc visuel session en cours en haut */}
			{hasActiveSession && timerDisplay && (
				<View style={styles.sessionBlock}>
					<Text style={styles.sessionTitle}>
						{timerDisplay.isRunning ? "⏱️" : "⏸️"} {t("SESSION.CURRENT")}
					</Text>
					<Text style={styles.sessionMethod}>{timerDisplay.methodName}</Text>
					<Text style={styles.sessionPhase}>
						{timerDisplay.isRunning ? "" : "⏸️ "}
						{t("TIMER.PHASE." + timerDisplay.phase.toUpperCase())} •{" "}
						{`${Math.floor(timerDisplay.timeLeft / 60)}:${(timerDisplay.timeLeft % 60).toString().padStart(2, "0")}`}
						{timerDisplay.isRunning ? " restantes" : " (en pause)"}
					</Text>
					<View style={styles.sessionButtonsRow}>
						<Pressable
							accessibilityRole="button"
							accessibilityLabel={t("SESSION.VIEW")}
							onPress={handleViewSession}
							style={styles.sessionViewButton}
						>
							<Text style={styles.sessionViewText}>{t("SESSION.VIEW")}</Text>
						</Pressable>
						<Pressable
							onPress={handleStopSession}
							style={styles.sessionStopButton}
							accessibilityRole="button"
							accessibilityLabel={t("SESSION.STOP")}
						>
							<Text style={styles.sessionStopText}>{t("SESSION.STOP")}</Text>
						</Pressable>
					</View>
				</View>
			)}

			{/* Message informatif si session en cours */}
			{hasActiveSession && (
				<View style={styles.infoBlock}>
					<Text style={[styles.infoText, { color: COLORS.textSecondary }]}>
						💡 {t("SESSION.DISABLED_METHODS")}
					</Text>
				</View>
			)}

			{/* Liste des méthodes, toutes désactivées si session en cours */}
			<FlatList
				data={allMethods}
				renderItem={({ item }) => (
					<MethodCard
						method={item}
						disabled={hasActiveSession}
						onPress={() => handleMethodPress(item)}
					/>
				)}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
			/>

			<FloatingActionButton onPress={() => setModalVisible(true)} disabled={hasActiveSession} />

			<AddMethodModal
				visible={modalVisible}
				onClose={() => setModalVisible(false)}
				onAdd={handleAddMethod}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16,
	} as ViewStyle,
	title: {
		fontSize: TYPOGRAPHY.sizes.xl,
		fontWeight: TYPOGRAPHY.weights.bold,
		marginBottom: 20,
		textAlign: "center",
	} as TextStyle,
	list: {
		paddingBottom: 20,
	} as ViewStyle,
	sessionBlock: {
		marginBottom: 16,
		padding: SPACING.xl,
		borderRadius: 16,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	} as ViewStyle,
	sessionTitle: {
		color: "#FFFFFF",
		fontWeight: TYPOGRAPHY.weights.bold,
		fontSize: TYPOGRAPHY.sizes.base,
		marginBottom: 8,
		letterSpacing: 1,
	} as TextStyle,
	sessionMethod: {
		color: "#FFFFFF",
		fontSize: TYPOGRAPHY.sizes.lg,
		fontWeight: TYPOGRAPHY.weights.semibold,
		marginBottom: 8,
	} as TextStyle,
	sessionPhase: {
		color: "rgba(255, 255, 255, 0.9)",
		fontSize: TYPOGRAPHY.sizes.base,
		marginBottom: 12,
	} as TextStyle,
	sessionButtonsRow: {
		flexDirection: "row",
		gap: SPACING.md,
		marginTop: 8,
	} as ViewStyle,
	sessionViewButton: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderWidth: 2,
		borderColor: "#FFFFFF",
	} as ViewStyle,
	sessionViewText: {
		color: "#4CAF50",
		fontWeight: TYPOGRAPHY.weights.bold,
		fontSize: TYPOGRAPHY.sizes.base,
	} as TextStyle,
	sessionStopButton: {
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderWidth: 2,
		borderColor: "#FFFFFF",
	} as ViewStyle,
	sessionStopText: {
		color: "#FFFFFF",
		fontWeight: TYPOGRAPHY.weights.bold,
		fontSize: TYPOGRAPHY.sizes.base,
	} as TextStyle,
	infoBlock: {
		marginBottom: 16,
		padding: SPACING.md,
		backgroundColor: "rgba(76, 175, 80, 0.1)",
		borderRadius: SPACING.radius.lg,
		borderLeftWidth: 4,
		borderLeftColor: "#4CAF50",
	} as ViewStyle,
	infoText: {
		fontSize: TYPOGRAPHY.sizes.sm,
		textAlign: "center",
	} as TextStyle,
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
		position: "relative",
	} as ViewStyle,
	menuButton: {
		marginRight: 12,
		padding: SPACING.padding.xs,
		borderRadius: SPACING.radius.lg,
	} as ViewStyle,
	headerTitle: {
		fontWeight: TYPOGRAPHY.weights.bold,
		marginBottom: 0,
		lineHeight: TYPOGRAPHY.lineHeights.base,
	} as TextStyle,
	headerTitleCentered: {
		position: "absolute",
		left: 0,
		right: 0,
		textAlign: "center",
	} as TextStyle,
});
