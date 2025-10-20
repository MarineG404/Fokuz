import { useThemeColors } from "@/constants/color";
import { TimerPhase, useTimer } from "@/utils/useTimer";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, StyleSheet, Text, View } from "react-native";
import { ConfirmModal } from "../modals/ConfirmModal";
import AppButton from "../ui/AppButton";
import { SessionCircularTimer } from "./SessionCircularTimer";

export interface TimerComponentProps {
	workDurationMinutes: number;
	breakDurationMinutes?: number;
	methodName?: string;
	methodId?: string;
	onPhaseChange?: (phase: TimerPhase) => void;
	onFinish?: () => void;
}

const getPhaseLabel = (phase: TimerPhase, t: (key: string) => string): string => {
	switch (phase) {
		case "work":
			return t("TIMER.PHASE.WORK");
		case "break":
			return t("TIMER.PHASE.BREAK");
		case "finished":
			return t("TIMER.PHASE.FINISHED");
		default:
			return "";
	}
};

export const TimerComponent: React.FC<TimerComponentProps> = ({
	workDurationMinutes,
	breakDurationMinutes,
	methodName,
	methodId,
	onPhaseChange,
	onFinish,
}) => {
	const COLORS = useThemeColors();
	const { t } = useTranslation();
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [fadeAnim] = useState(new Animated.Value(1));
	const [scaleAnim] = useState(new Animated.Value(1));
	const [phaseAnim] = useState(new Animated.Value(0));

	const timer = useTimer({
		workDurationMinutes,
		breakDurationMinutes,
		methodName,
		methodId,
		onPhaseChange,
		onFinish,
	});

	useEffect(() => {
		if (timer.timeLeft > 0) {
			Animated.sequence([
				Animated.timing(phaseAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
				Animated.timing(phaseAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
			]).start();
		}
	}, [timer.phase, timer.timeLeft, phaseAnim]);

	useEffect(() => {
		Animated.timing(scaleAnim, {
			toValue: timer.isRunning ? 1.02 : 1,
			duration: 200,
			useNativeDriver: true,
		}).start();
	}, [timer.isRunning, scaleAnim]);

	const handleTerminate = () => setShowConfirmModal(true);
	const confirmTerminate = () => {
		timer.reset();
		setShowConfirmModal(false);
	};
	const cancelTerminate = () => setShowConfirmModal(false);

	return (
		<View style={styles.container}>
			<Animated.View style={[styles.header, { opacity: fadeAnim }]}>
				<Text style={[styles.sectionTitle, { color: COLORS.primary }]}>{t("TIMER.TITLE")}</Text>
				{timer.sessionCount > 0 && (
					<Text style={[styles.sessionCounter, { color: COLORS.textSecondary }]}>
						{t("TIMER.SESSION_COUNT", { count: timer.sessionCount })}
					</Text>
				)}
			</Animated.View>

			{timer.timeLeft > 0 ? (
				<Animated.View style={[styles.timerContainer, { transform: [{ scale: scaleAnim }] }]}>
					<Animated.View
						style={[
							styles.phaseIndicator,
							{
								backgroundColor: timer.phase === "work" ? COLORS.workColor : COLORS.breakColor,
								transform: [
									{ scale: phaseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) },
								],
								opacity: phaseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }),
							},
						]}
					>
						<Ionicons
							name={timer.phase === "work" ? "briefcase" : "cafe"}
							size={16}
							color="white"
							style={styles.phaseIcon}
						/>
						<Text style={styles.phaseText}>{getPhaseLabel(timer.phase, t)}</Text>
					</Animated.View>

					<SessionCircularTimer
						workDurationMinutes={workDurationMinutes}
						breakDurationMinutes={breakDurationMinutes ?? 0}
						currentPhase={timer.phase}
						timeLeft={timer.timeLeft}
						formattedTime={timer.formattedTime}
					/>
				</Animated.View>
			) : (
				<Animated.View style={[styles.readyContainer, { opacity: fadeAnim }]}>
					<Ionicons
						name={timer.sessionCount > 0 ? "checkmark-circle" : "play-circle"}
						size={48}
						color={COLORS.primary}
						style={styles.readyIcon}
					/>
					<Text style={[styles.readyText, { color: COLORS.text }]}>
						{timer.sessionCount > 0 ? t("TIMER.STATUS.COMPLETED") : t("TIMER.STATUS.READY")}
					</Text>
					{timer.sessionCount > 0 && (
						<Text style={[styles.readySubText, { color: COLORS.textSecondary }]}>
							{t("TIMER.STATUS.CONGRATS")}
						</Text>
					)}
				</Animated.View>
			)}

			<Animated.View style={[styles.buttonRow, { opacity: fadeAnim }]}>
				{timer.timeLeft === 0 ? (
					<View style={styles.buttonRow}>
						<AppButton
							title={
								timer.sessionCount > 0 ? t("TIMER.BUTTONS.NEW_SESSION") : t("TIMER.BUTTONS.START")
							}
							onPress={timer.sessionCount > 0 ? timer.restart : timer.start}
							iconName={timer.sessionCount > 0 ? "refresh" : "play"}
							variant="primary"
						/>
						{timer.sessionCount > 0 && (
							<AppButton
								title={t("TIMER.BUTTONS.FINISH")}
								onPress={handleTerminate}
								iconName="stop"
								variant="muted"
							/>
						)}
					</View>
				) : (
					<>
						<AppButton
							title={timer.isRunning ? t("TIMER.BUTTONS.PAUSE") : t("TIMER.BUTTONS.RESUME")}
							onPress={timer.toggle}
							iconName={timer.isRunning ? "pause" : "play"}
							variant="primary"
							activeOpacity={0.85}
							style={{ transform: [{ scale: timer.isRunning ? 1.05 : 1 }] }}
						/>
						<AppButton
							title={t("TIMER.BUTTONS.FINISH")}
							onPress={handleTerminate}
							iconName="stop"
							variant="muted"
						/>
					</>
				)}
			</Animated.View>

			<ConfirmModal
				visible={showConfirmModal}
				title={t("TIMER.CONFIRM_MODAL.TITLE")}
				message={t("TIMER.CONFIRM_MODAL.MESSAGE")}
				confirmText={t("TIMER.BUTTONS.FINISH")}
				cancelText={t("MODAL.CONFIRM.CANCEL_BUTTON")}
				onConfirm={confirmTerminate}
				onCancel={cancelTerminate}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 24,
		alignItems: "center",
		paddingHorizontal: 20,
	},
	header: {
		alignItems: "center",
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "700",
		marginBottom: 6,
		letterSpacing: 0.5,
	},
	sessionCounter: {
		fontSize: 14,
		fontWeight: "500",
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 12,
		backgroundColor: "rgba(0,0,0,0.05)",
	},
	timerContainer: {
		marginBottom: 36,
		alignItems: "center",
		justifyContent: "center",
	},
	readyContainer: {
		height: 220,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 30,
	},
	readyIcon: {
		marginBottom: 16,
	},
	readyText: {
		fontSize: 18,
		fontWeight: "500",
		textAlign: "center",
		marginBottom: 8,
	},
	readySubText: {
		fontSize: 14,
		textAlign: "center",
		fontStyle: "italic",
	},
	phaseIndicator: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 3,
	},
	phaseIcon: {
		marginRight: 6,
	},
	phaseText: {
		color: "white",
		fontSize: 14,
		fontWeight: "600",
	},
	buttonRow: {
		flexDirection: "row",
		gap: 16,
		justifyContent: "center",
		marginTop: 8,
	},
	button: {
		flexDirection: "row",
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 12,
		minWidth: 120,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
	},
	primaryButton: {
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 3,
	},
	buttonIcon: {
		marginRight: 6,
	},
	resetButton: {
		backgroundColor: "transparent",
		borderWidth: 0,
		elevation: 0,
		shadowOpacity: 0,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
});
