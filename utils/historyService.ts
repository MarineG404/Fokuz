import { DailyStats, SessionRecord } from '@/types/session';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
	SESSIONS: '@fokuz/sessions',
	DAILY_STATS: '@fokuz/daily_stats',
};

class HistoryService {
	// Sauvegarder une session
	async saveSession(session: SessionRecord): Promise<void> {
		try {
			const existingSessions = await this.getAllSessions();
			const updatedSessions = [session, ...existingSessions];

			await AsyncStorage.setItem(
				STORAGE_KEYS.SESSIONS,
				JSON.stringify(updatedSessions)
			);

			// Mettre à jour les stats quotidiennes
			await this.updateDailyStats(session);
		} catch (error) {
			console.error('Erreur lors de la sauvegarde de session:', error);
		}
	}

	// Récupérer toutes les sessions
	async getAllSessions(): Promise<SessionRecord[]> {
		try {
			const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
			if (!data) return [];

			const sessions = JSON.parse(data);
			// Convertir les dates string en objets Date
			return sessions.map((session: any) => ({
				...session,
				startTime: new Date(session.startTime),
				endTime: new Date(session.endTime),
			}));
		} catch (error) {
			console.error('Erreur lors de la récupération des sessions:', error);
			return [];
		}
	}

	// Récupérer les sessions d'une date spécifique
	async getSessionsByDate(date: string): Promise<SessionRecord[]> {
		const allSessions = await this.getAllSessions();
		return allSessions.filter(session => session.date === date);
	}

	// Récupérer les sessions des N derniers jours
	async getRecentSessions(days: number = 7): Promise<SessionRecord[]> {
		const allSessions = await this.getAllSessions();
		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - days);

		return allSessions.filter(session =>
			session.startTime >= cutoffDate
		);
	}

	// Mettre à jour les statistiques quotidiennes
	private async updateDailyStats(session: SessionRecord): Promise<void> {
		try {
			const existingStats = await this.getDailyStats();
			const dateStats = existingStats[session.date] || {
				date: session.date,
				totalSessions: 0,
				totalWorkTime: 0,
				totalBreakTime: 0,
				completedSessions: 0,
				methods: {},
			};

			// Mettre à jour les stats
			dateStats.totalSessions += 1;
			dateStats.totalWorkTime += session.totalWorkTime;
			dateStats.totalBreakTime += session.totalBreakTime;

			if (session.isCompleted) {
				dateStats.completedSessions += 1;
			}

			// Stats par méthode
			if (!dateStats.methods[session.methodName]) {
				dateStats.methods[session.methodName] = {
					count: 0,
					workTime: 0,
				};
			}
			dateStats.methods[session.methodName].count += 1;
			dateStats.methods[session.methodName].workTime += session.totalWorkTime;

			// Sauvegarder
			const updatedStats = {
				...existingStats,
				[session.date]: dateStats,
			};

			await AsyncStorage.setItem(
				STORAGE_KEYS.DAILY_STATS,
				JSON.stringify(updatedStats)
			);
		} catch (error) {
			console.error('Erreur lors de la mise à jour des stats:', error);
		}
	}

	// Récupérer les statistiques quotidiennes
	async getDailyStats(): Promise<{ [date: string]: DailyStats }> {
		try {
			const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_STATS);
			return data ? JSON.parse(data) : {};
		} catch (error) {
			console.error('Erreur lors de la récupération des stats:', error);
			return {};
		}
	}

	// Obtenir les stats d'une période
	async getStatsForPeriod(startDate: string, endDate: string): Promise<DailyStats[]> {
		const allStats = await this.getDailyStats();
		const result: DailyStats[] = [];

		const start = new Date(startDate);
		const end = new Date(endDate);

		for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
			const dateStr = date.toISOString().split('T')[0];
			if (allStats[dateStr]) {
				result.push(allStats[dateStr]);
			}
		}

		return result;
	}

	// Supprimer toutes les données (pour debug/reset)
	async clearAllData(): Promise<void> {
		try {
			await AsyncStorage.multiRemove([
				STORAGE_KEYS.SESSIONS,
				STORAGE_KEYS.DAILY_STATS,
			]);
		} catch (error) {
			console.error('Erreur lors de la suppression des données:', error);
		}
	}

	// Formater la durée en heures/minutes
	formatDuration(minutes: number): string {
		if (minutes < 60) {
			return `${minutes}min`;
		}

		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;

		if (remainingMinutes === 0) {
			return `${hours}h`;
		}

		return `${hours}h ${remainingMinutes}min`;
	}

	// Générer un ID unique pour une session
	generateSessionId(): string {
		return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
}

export const historyService = new HistoryService();
