import { useThemeColors } from '@/constants/color';
import { historyService } from '@/utils/historyService';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

	const StatItem = ({
		icon,
		value,
		label,
		color = COLORS.primary
	}: {
		icon: string;
		value: string | number;
		label: string;
		color?: string;
	}) => (
		<View style={styles.statItem}>
			<Ionicons name={icon as any} size={20} color={color} />
			<Text style={[styles.statValue, { color: COLORS.text }]}>
				{value}
			</Text>
			<Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
				{label}
			</Text>
		</View>
	);

	if (totalSessions === 0) {
		return null; // Ne pas afficher la card si pas de sessions
	}

	return (
		<View style={[
			styles.container,
			COLORS.text === '#000' ? styles.containerLight : styles.containerDark,
			{ backgroundColor: COLORS.cardBackground }
		]}>
			<View style={styles.header}>
				<Ionicons name="stats-chart" size={20} color={COLORS.primary} />
				<Text style={[styles.title, { color: COLORS.text }]}>
					Statistiques
				</Text>
			</View>

			<View style={styles.statsGrid}>
				<StatItem
					icon="document-text"
					value={totalSessions}
					label="Sessions"
				/>

				<StatItem
					icon="checkmark-circle"
					value={completedSessions}
					label="Terminées"
					color="#10B981"
				/>

				<StatItem
					icon="time"
					value={historyService.formatDuration(totalWorkTime)}
					label="Temps total"
				/>

				<StatItem
					icon="trending-up"
					value={`${completionRate}%`}
					label="Taux de réussite"
					color={completionRate >= 80 ? '#10B981' : completionRate >= 60 ? '#F59E0B' : '#EF4444'}
				/>
			</View>

			{avgWorkTime > 0 && (
				<View style={styles.additionalStats}>
					<View style={styles.avgStat}>
						<Text style={[styles.avgValue, { color: COLORS.text }]}>
							{historyService.formatDuration(avgWorkTime)}
						</Text>
						<Text style={[styles.avgLabel, { color: COLORS.textSecondary }]}>
							Durée moyenne par session
						</Text>
					</View>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 16,
		padding: 20,
		marginBottom: 24,
	},
	containerLight: {
		borderWidth: 1,
		borderColor: '#E5E7EB',
		backgroundColor: '#FAFAFA',
	},
	containerDark: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 4,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8,
	},
	statsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		gap: 16,
	},
	statItem: {
		alignItems: 'center',
		minWidth: '22%',
		flex: 1,
	},
	statValue: {
		fontSize: 18,
		fontWeight: '700',
		marginTop: 8,
		marginBottom: 4,
	},
	statLabel: {
		fontSize: 11,
		textAlign: 'center',
		lineHeight: 14,
	},
	additionalStats: {
		marginTop: 16,
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: 'rgba(0,0,0,0.08)',
	},
	avgStat: {
		alignItems: 'center',
	},
	avgValue: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 4,
	},
	avgLabel: {
		fontSize: 12,
		textAlign: 'center',
	},
});
