import { useThemeColors } from '@/constants/color';
import { SessionRecord } from '@/types/session';
import { historyService } from '@/utils/historyService';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SessionCardProps {
	session: SessionRecord;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
	const COLORS = useThemeColors();

	const getMethodIcon = (methodName: string) => {
		switch (methodName.toLowerCase()) {
			case 'pomodoro':
				return 'repeat-outline';
			case 'deep work':
				return 'briefcase-outline';
			case 'méthode 52/17':
				return 'hourglass-outline';
			default:
				return 'timer-outline';
		}
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString('fr-FR', {
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	const getSessionDuration = () => {
		const durationMs = session.endTime.getTime() - session.startTime.getTime();
		const durationMinutes = Math.round(durationMs / (1000 * 60));
		return historyService.formatDuration(durationMinutes);
	};

	const getStatusInfo = () => {
		if (session.isCompleted) {
			return {
				icon: 'checkmark-circle' as const,
				color: '#10B981', // Vert success
				text: 'Terminée',
			};
		} else {
			return {
				icon: 'close-circle' as const,
				color: '#EF4444', // Rouge
				text: 'Abandonnée',
			};
		}
	};

	const statusInfo = getStatusInfo();

	return (
		<View style={[
			styles.container,
			COLORS.text === '#000' ? styles.containerLight : styles.containerDark,
			{ backgroundColor: COLORS.cardBackground }
		]}>
			{/* Header avec méthode et statut */}
			<View style={styles.header}>
				<View style={styles.methodInfo}>
					<Ionicons
						name={getMethodIcon(session.methodName)}
						size={20}
						color={COLORS.primary}
						style={styles.methodIcon}
					/>
					<Text style={[styles.methodName, { color: COLORS.text }]}>
						{session.methodName}
					</Text>
				</View>
				<View style={styles.statusContainer}>
					<Ionicons
						name={statusInfo.icon}
						size={16}
						color={statusInfo.color}
					/>
					<Text style={[styles.statusText, { color: statusInfo.color }]}>
						{statusInfo.text}
					</Text>
				</View>
			</View>

			{/* Statistiques de la session */}
			<View style={styles.statsContainer}>
				<View style={styles.statItem}>
					<Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
					<Text style={[styles.statValue, { color: COLORS.text }]}>
						{getSessionDuration()}
					</Text>
					<Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
						Durée totale
					</Text>
				</View>

				<View style={styles.statItem}>
					<Ionicons name="briefcase-outline" size={16} color={COLORS.textSecondary} />
					<Text style={[styles.statValue, { color: COLORS.text }]}>
						{historyService.formatDuration(session.totalWorkTime)}
					</Text>
					<Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
						Travail
					</Text>
				</View>

				{session.totalBreakTime > 0 && (
					<View style={styles.statItem}>
						<Ionicons name="cafe-outline" size={16} color={COLORS.textSecondary} />
						<Text style={[styles.statValue, { color: COLORS.text }]}>
							{historyService.formatDuration(session.totalBreakTime)}
						</Text>
						<Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
							Pause
						</Text>
					</View>
				)}

				<View style={styles.statItem}>
					<Ionicons name="repeat-outline" size={16} color={COLORS.textSecondary} />
					<Text style={[styles.statValue, { color: COLORS.text }]}>
						{session.completedCycles}
					</Text>
					<Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
						Cycles
					</Text>
				</View>
			</View>

			{/* Footer avec horaire */}
			<View style={styles.footer}>
				<Text style={[styles.timeRange, { color: COLORS.textSecondary }]}>
					{formatTime(session.startTime)} → {formatTime(session.endTime)}
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 16,
		padding: 20,
		marginBottom: 12,
	},
	containerLight: {
		borderWidth: 1,
		borderColor: '#E5E7EB',
	},
	containerDark: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	methodInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	methodIcon: {
		marginRight: 8,
	},
	methodName: {
		fontSize: 16,
		fontWeight: '600',
	},
	statusContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	statusText: {
		fontSize: 12,
		fontWeight: '500',
	},
	statsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 12,
	},
	statItem: {
		alignItems: 'center',
		flex: 1,
	},
	statValue: {
		fontSize: 14,
		fontWeight: '600',
		marginTop: 4,
		marginBottom: 2,
	},
	statLabel: {
		fontSize: 11,
		textAlign: 'center',
	},
	footer: {
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: 'rgba(0,0,0,0.08)',
	},
	timeRange: {
		fontSize: 12,
		textAlign: 'center',
		fontFamily: 'monospace',
	},
});
