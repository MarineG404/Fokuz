import { SessionCard } from "@/components/cards/SessionCard";
import { StatsCard } from "@/components/cards/StatsCard";
import BlockCard from "@/components/ui/BlockCard";
import { HeaderTitle } from "@/components/ui/HeaderTitle";
import { useThemeColors } from "@/constants/color";
import { SessionRecord } from "@/types/session";
import { historyService } from "@/utils/historyService";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterType = "all" | "today" | "week" | "month";

export default function HistoryScreen() {
	const COLORS = useThemeColors();
	const [sessions, setSessions] = useState<SessionRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<FilterType>("all");

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
				},
			]}
			onPress={() => setFilter(type)}
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
			return "Aujourd'hui";
		} else if (dateStr === yesterday.toISOString().split("T")[0]) {
			return "Hier";
		} else {
			return date.toLocaleDateString("fr-FR", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		}
	};

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
			<HeaderTitle title="Historique" />

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
				<View style={styles.filtersContainer}>
					<FilterButton type="all" label="Tout" />
					<FilterButton type="today" label="Aujourd'hui" />
					<FilterButton type="week" label="7 jours" />
					<FilterButton type="month" label="30 jours" />
				</View>

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
						<Text style={[styles.emptyTitle, { color: COLORS.text }]}>Aucune session trouvée</Text>
						<Text style={[styles.emptySubtitle, { color: COLORS.textSecondary }]}>
							{filter === "all"
								? "Commencez votre première session pour voir l'historique ici"
								: "Aucune session pour cette période"}
						</Text>
					</View>
				) : (
					groupSessionsByDate().map(({ date, sessions: dateSessions }) => (
						<View key={date} style={styles.dateGroup}>
							<Text style={[styles.dateHeader, { color: COLORS.text }]}>
								{formatDateHeader(date)}
							</Text>
							{dateSessions.map((session) => (
								<SessionCard key={session.id} session={session} />
							))}
						</View>
					))
				)}
				{sessions.length === 0 && (
					<BlockCard>
						<View style={styles.emptyState}>
							<Ionicons
								name="document-text-outline"
								size={48}
								color={COLORS.textSecondary}
								style={styles.emptyIcon}
							/>
							<Text style={[styles.emptyTitle, { color: COLORS.text }]}>
								Aucune session trouvée
							</Text>
							<Text style={[styles.emptySubtitle, { color: COLORS.textSecondary }]}>
								{filter === "all"
									? "Commencez votre première session pour voir l'historique ici"
									: "Aucune session pour cette période"}
							</Text>
						</View>
					</BlockCard>
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
	filtersContainer: {
		flexDirection: "row",
		gap: 8,
		marginBottom: 20,
		paddingHorizontal: 4,
	},
	filterButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		borderWidth: 1,
	},
	filterButtonActive: {
		// Style dynamique appliqué via backgroundColor
	},
	filterButtonText: {
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
