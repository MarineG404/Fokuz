import { SessionCard } from "@/components/cards/SessionCard";
import { StatsCard } from "@/components/cards/StatsCard";
import { HeaderTitle } from "@/components/ui/HeaderTitle";
import { useThemeColors } from "@/constants/color";
import { SessionRecord } from "@/types/session";
import { historyService } from "@/utils/historyService";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Alert,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterType = "all" | "today" | "week" | "month";

export default function HistoryScreen() {
	const COLORS = useThemeColors();
	const [sessions, setSessions] = useState<SessionRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<FilterType>("all");
	const { t } = useTranslation();

	const loadSessions = useCallback(async () => {
		try {
			setLoading(true);
			let loadedSessions: SessionRecord[] = [];

			switch (filter) {
				case "today":
					const today = new Date().toISOString().split("T")[0];
					loadedSessions = await historyService.getSessionsByDate(today);
					break;
				case "week":
					loadedSessions = await historyService.getRecentSessions(7);
					break;
				case "month":
					loadedSessions = await historyService.getRecentSessions(30);
					break;
				default:
					loadedSessions = await historyService.getAllSessions();
			}

			setSessions(loadedSessions);
		} catch (error) {
			console.error("Erreur lors du chargement des sessions:", error);
		} finally {
			setLoading(false);
		}
	}, [filter]);

	useFocusEffect(
		useCallback(() => {
			loadSessions();
		}, [loadSessions]),
	);

	const getFilteredStats = () => {
		const totalSessions = sessions.length;
		const completedSessions = sessions.filter((s) => s.isCompleted).length;
		const totalWorkTime = sessions.reduce((sum, s) => sum + s.totalWorkTime, 0);
		const avgWorkTime = totalSessions > 0 ? Math.round(totalWorkTime / totalSessions) : 0;

		return {
			totalSessions,
			completedSessions,
			totalWorkTime,
			avgWorkTime,
			completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
		};
	};

	const stats = getFilteredStats();

	const FilterButton = ({ type, label }: { type: FilterType; label: string }) => (
		<TouchableOpacity
			style={[
				styles.filterButton,
				filter === type && styles.filterButtonActive,
				{
					borderColor: COLORS.primary,
					backgroundColor: filter === type ? COLORS.primary : "transparent",
				},
			]}
			onPress={() => setFilter(type)}
			accessibilityRole="button"
			accessibilityLabel={label}
		>
			<Text
				style={[
					styles.filterButtonText,
					{
						color: filter === type ? "white" : COLORS.textSecondary,
					},
				]}
			>
				{label}
			</Text>
		</TouchableOpacity>
	);

	const groupSessionsByDate = () => {
		const grouped: { [date: string]: SessionRecord[] } = {};

		sessions.forEach((session) => {
			if (!grouped[session.date]) {
				grouped[session.date] = [];
			}
			grouped[session.date].push(session);
		});

		return Object.entries(grouped)
			.sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
			.map(([date, sessions]) => ({ date, sessions }));
	};

	const formatDateHeader = (dateStr: string) => {
		const date = new Date(dateStr);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (dateStr === today.toISOString().split("T")[0]) {
			return t("DATES.TODAY");
		} else if (dateStr === yesterday.toISOString().split("T")[0]) {
			return t("DATES.YESTERDAY");
		} else {
			return date.toLocaleDateString("fr-FR", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		}
	};

	const handleClearHistory = async () => {
		Alert.alert(t("HISTORY.DELETE_TITLE"), t("HISTORY.DELETE_CONFIRM"), [
			{ text: t("MODAL.CONFIRM.CANCEL_BUTTON"), style: "cancel" },
			{
				text: t("HISTORY.DELETE_BUTTON"),
				style: "destructive",
				onPress: async () => {
					await historyService.clearAllData();
					loadSessions();
				},
			},
		]);
	};

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
			<HeaderTitle title={t("HISTORY.TITLE")} />

			<ScrollView
				style={styles.content}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={loading}
						onRefresh={loadSessions}
						colors={[COLORS.primary]}
						tintColor={COLORS.primary}
					/>
				}
			>
				{/* Filtres */}
				<View style={styles.filtersRow}>
					<FilterButton type="all" label={t("FILTERS.ALL")} />
					<FilterButton type="today" label={t("FILTERS.TODAY")} />
					<FilterButton type="week" label={t("FILTERS.WEEK")} />
					<FilterButton type="month" label={t("FILTERS.MONTH")} />
				</View>

				{/* Bouton supprimer */}
				<TouchableOpacity
					style={[styles.deleteButton, { borderColor: COLORS.primary }]}
					onPress={handleClearHistory}
					accessibilityRole="button"
					accessibilityLabel={t("HISTORY.DELETE_BUTTON")}
				>
					<Ionicons name="trash-outline" size={18} color={COLORS.textSecondary} accessible={false} />
					<Text style={[styles.deleteButtonText, { color: COLORS.textSecondary }]}>
						{t("HISTORY.DELETE_BUTTON")}
					</Text>
				</TouchableOpacity>

				{/* Statistiques */}
				<StatsCard
					totalSessions={stats.totalSessions}
					completedSessions={stats.completedSessions}
					totalWorkTime={stats.totalWorkTime}
					avgWorkTime={stats.avgWorkTime}
					completionRate={stats.completionRate}
				/>

				{/* Sessions groupées par date */}
				{sessions.length === 0 ? (
					<View style={[styles.emptyState, { backgroundColor: COLORS.cardBackground }]}>
						<Ionicons
							name="document-text-outline"
							size={48}
							color={COLORS.textSecondary}
							style={styles.emptyIcon}
						/>
						<Text style={[styles.emptyTitle, { color: COLORS.text }]}>
							{t("EMPTY_STATE.TITLE")}
						</Text>
						<Text style={[styles.emptySubtitle, { color: COLORS.textSecondary }]}>
							{t(filter === "all" ? "EMPTY_STATE.SUBTITLE_ALL" : "EMPTY_STATE.SUBTITLE_FILTERED")}
						</Text>
					</View>
				) : (
					groupSessionsByDate().map(({ date, sessions: dateSessions }) => (
						<View key={date} style={styles.dateGroup}>
							<Text style={[styles.dateHeader, { color: COLORS.text }]}>
								{formatDateHeader(date)}
							</Text>
							{dateSessions.map((session, index) => {
								// Générer une clé unique même si l'id est dupliqué ou absent
								const uniqueKey = `${session.id ?? "noid"}-${session.startTime instanceof Date ? session.startTime.getTime() : new Date(session.startTime).getTime()}-${index}`;
								return <SessionCard key={uniqueKey} session={session} />;
							})}
						</View>
					))
				)}
			</ScrollView>
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
	},
	filtersRow: {
		flexDirection: "row",
		gap: 8,
		marginBottom: 12,
		paddingHorizontal: 4,
	},
	filterButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		borderWidth: 1,
	},
	filterButtonActive: {},
	filterButtonText: {
		fontSize: 14,
		fontWeight: "500",
	},
	deleteButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 12,
		borderWidth: 1,
		marginBottom: 20,
		marginHorizontal: 4,
	},
	deleteButtonText: {
		fontSize: 14,
		fontWeight: "500",
	},
	emptyState: {
		padding: 32,
		borderRadius: 16,
		alignItems: "center",
		marginTop: 40,
	},
	emptyIcon: {
		marginBottom: 16,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 8,
		textAlign: "center",
	},
	emptySubtitle: {
		fontSize: 14,
		textAlign: "center",
		lineHeight: 20,
	},
	dateGroup: {
		marginBottom: 24,
	},
	dateHeader: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 12,
		marginLeft: 4,
		textTransform: "capitalize",
	},
});
