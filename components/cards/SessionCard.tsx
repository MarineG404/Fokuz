import { useThemeColors } from "@/constants/color";
import SPACING from '@/constants/spacing';
import TYPOGRAPHY from '@/constants/typography';
import { SessionRecord } from "@/types/session";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import {
	StyleSheet,
	Text,
	TextStyle,
	View,
	ViewStyle
} from "react-native";
import BlockCard from "../ui/BlockCard";

interface SessionCardProps {
	session: SessionRecord;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
	const COLORS = useThemeColors();
	const { t } = useTranslation();

	const getMethodIcon = (methodName: string) => {
		switch (methodName.toLowerCase()) {
			case "pomodoro":
				return "repeat-outline";
			case "deep work":
				return "briefcase-outline";
			case "méthode 52/17":
				return "hourglass-outline";
			default:
				return "timer-outline";
		}
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("fr-FR", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// Durée totale = travail + pause (en secondes)
	const getSessionTotalDuration = () => {
		const totalSeconds = (session.totalWorkTime || 0) + (session.totalBreakTime || 0);
		return formatDuration(totalSeconds);
	};

	const getStatusInfo = () => {
		if (session.isCompleted) {
			return {
				icon: "checkmark-circle" as const,
				color: "#10B981",
				text: t("SESSION.STATUS.COMPLETED"),
			};
		} else {
			return {
				icon: "close-circle" as const,
				color: "#EF4444",
				text: t("SESSION.STATUS.ABANDONED"),
			};
		}
	};

	const statusInfo = getStatusInfo();

	return (
		<BlockCard style={styles.container}>
			<View style={styles.header}>
				<View style={styles.methodInfo}>
					<Ionicons
						name={getMethodIcon(session.methodName)}
						size={20}
						color={COLORS.primary}
						style={styles.methodIcon}
					/>
					<Text style={[styles.methodName, { color: COLORS.text }]}>{session.methodName}</Text>
				</View>
				<View style={styles.statusContainer}>
					<Ionicons name={statusInfo.icon} size={16} color={statusInfo.color} />
					<Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</Text>
				</View>
			</View>

			<View style={styles.statsContainer}>
				<View style={styles.statItem}>
					<Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
					<Text style={[styles.statValue, { color: COLORS.text }]}>
						{getSessionTotalDuration()}
					</Text>
					<Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
						{t("SESSION.STATS.TOTAL_DURATION")}
					</Text>
				</View>

				<View style={styles.statItem}>
					<Ionicons name="briefcase-outline" size={16} color={COLORS.textSecondary} />
					<Text style={[styles.statValue, { color: COLORS.text }]}>
						{formatDuration(session.totalWorkTime)}
					</Text>
					<Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
						{t("SESSION.STATS.WORK")}
					</Text>
				</View>

				{session.totalBreakTime > 0 && (
					<View style={styles.statItem}>
						<Ionicons name="cafe-outline" size={16} color={COLORS.textSecondary} />
						<Text style={[styles.statValue, { color: COLORS.text }]}>
							{formatDuration(session.totalBreakTime)}
						</Text>
						<Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
							{t("SESSION.STATS.BREAK")}
						</Text>
					</View>
				)}

				<View style={styles.statItem}>
					<Ionicons name="repeat-outline" size={16} color={COLORS.textSecondary} />
					<Text style={[styles.statValue, { color: COLORS.text }]}>
						{" "}
						{session.isCompleted
							? session.completedCycles
							: Math.max(0, session.completedCycles - 1)}{" "}
					</Text>
					<Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
						{t("SESSION.STATS.CYCLES")}
					</Text>
				</View>
			</View>

			<View style={styles.footer}>
				<Text style={[styles.timeRange, { color: COLORS.textSecondary }]}>
					{formatTime(session.startTime)} → {formatTime(session.endTime)}
				</Text>
			</View>
		</BlockCard>
	);
};

const styles = StyleSheet.create({
	container: { marginBottom: 12 } as ViewStyle,
	containerLight: { borderWidth: 1, borderColor: "#E5E7EB" } as ViewStyle,
	containerDark: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
	} as ViewStyle,
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	} as ViewStyle,
	methodInfo: { flexDirection: "row", alignItems: "center", flex: 1 } as ViewStyle,
	methodIcon: { marginRight: 8 } as TextStyle,
	methodName: { fontSize: TYPOGRAPHY.sizes.base, fontWeight: TYPOGRAPHY.weights.semibold } as TextStyle,
	statusContainer: { flexDirection: "row", alignItems: "center", gap: SPACING.xs } as ViewStyle,
	statusText: { fontSize: TYPOGRAPHY.sizes.xs, fontWeight: TYPOGRAPHY.weights.medium } as TextStyle,
	statsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 } as ViewStyle,
	statItem: { alignItems: "center", flex: 1 } as ViewStyle,
	statValue: { fontSize: TYPOGRAPHY.sizes.sm, fontWeight: TYPOGRAPHY.weights.semibold, marginTop: 4, marginBottom: 2 } as TextStyle,
	statLabel: { fontSize: TYPOGRAPHY.sizes.xs, textAlign: "center" } as TextStyle,
	footer: { paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.08)" } as ViewStyle,
	timeRange: { fontSize: TYPOGRAPHY.sizes.xs, textAlign: "center", fontFamily: "monospace" } as TextStyle,
});

export default SessionCard;

const formatDuration = (seconds: number) => {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	if (seconds === 0) return "-";
	if (m > 0) return `${m}min ${s.toString().padStart(2, "0")}s`;
	return `${s}s`;
};
