import { useThemeColors } from "@/constants/color";
import SPACING from "@/constants/spacing";
import TYPOGRAPHY from "@/constants/typography";
import { historyService } from "@/utils/historyService";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import BlockCard from "../ui/BlockCard";

interface StatsCardProps {
	totalSessions: number;
	completedSessions: number;
	totalWorkTime: number;
	avgWorkTime: number;
	completionRate: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
	totalSessions,
	completedSessions,
	totalWorkTime,
	avgWorkTime,
	completionRate,
}) => {
	const COLORS = useThemeColors();
	const { t } = useTranslation();

	const StatItem = ({
		icon,
		value,
		label,
		color = COLORS.primary,
	}: {
		icon: string;
		value: string | number;
		label: string;
		color?: string;
	}) => (
		<View style={styles.statItem}>
			<Ionicons name={icon as any} size={20} color={color} />
			<Text style={[styles.statValue, { color: COLORS.text }]}>{value}</Text>
			<Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>{label}</Text>
		</View>
	);

	if (totalSessions === 0) {
		return null; // Ne pas afficher la card si pas de sessions
	}

	return (
		<BlockCard style={styles.container}>
			<View style={styles.header}>
				<Ionicons name="stats-chart" size={20} color={COLORS.primary} />
				<Text style={[styles.title, { color: COLORS.text }]}>{t("STATS.TITLE")}</Text>
			</View>

			<View style={styles.statsGrid}>
				<StatItem icon="document-text" value={totalSessions} label={t("STATS.SESSIONS")} />

				<StatItem
					icon="checkmark-circle"
					value={completedSessions}
					label={t("STATS.COMPLETED")}
					color="#10B981"
				/>

				<StatItem
					icon="time"
					value={historyService.formatDuration(totalWorkTime)}
					label={t("STATS.TOTAL_TIME")}
				/>

				<StatItem
					icon="trending-up"
					value={`${completionRate}%`}
					label={t("STATS.SUCCESS_RATE")}
					color={completionRate >= 80 ? "#10B981" : completionRate >= 60 ? "#F59E0B" : "#EF4444"}
				/>
			</View>

			{avgWorkTime > 0 && (
				<View style={styles.additionalStats}>
					<View style={styles.avgStat}>
						<Text style={[styles.avgValue, { color: COLORS.text }]}>
							{historyService.formatDuration(avgWorkTime)}
						</Text>
						<Text style={[styles.avgLabel, { color: COLORS.textSecondary }]}>
							{t("STATS.AVG_DURATION")}
						</Text>
					</View>
				</View>
			)}
		</BlockCard>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 24,
	} as ViewStyle,
	containerLight: {
		borderWidth: 1,
		borderColor: "#E5E7EB",
	} as ViewStyle,
	containerDark: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 4,
	} as ViewStyle,
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	} as ViewStyle,
	title: {
		fontSize: TYPOGRAPHY.sizes.base,
		fontWeight: TYPOGRAPHY.weights.semibold,
		marginLeft: 8,
	} as TextStyle,
	statsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		gap: SPACING.lg,
	} as ViewStyle,
	statItem: {
		alignItems: "center",
		minWidth: "22%",
		flex: 1,
	} as ViewStyle,
	statValue: {
		fontSize: TYPOGRAPHY.sizes.md,
		fontWeight: TYPOGRAPHY.weights.semibold,
		marginTop: 8,
		marginBottom: 4,
	} as TextStyle,
	statLabel: {
		fontSize: TYPOGRAPHY.sizes.xs,
		textAlign: "center",
		lineHeight: TYPOGRAPHY.lineHeights.xs,
	} as TextStyle,
	additionalStats: {
		marginTop: 16,
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: "rgba(0,0,0,0.08)",
	} as ViewStyle,
	avgStat: {
		alignItems: "center",
	} as ViewStyle,
	avgValue: {
		fontSize: TYPOGRAPHY.sizes.base,
		fontWeight: TYPOGRAPHY.weights.semibold,
		marginBottom: 4,
	} as TextStyle,
	avgLabel: {
		fontSize: TYPOGRAPHY.sizes.xs,
		textAlign: "center",
	} as TextStyle,
});
