export interface SessionRecord {
	id: string;
	methodName: string;
	methodId: string;
	workDuration: number; // en minutes
	breakDuration?: number; // en minutes
	completedCycles: number;
	totalWorkTime: number; // temps réel travaillé en minutes
	totalBreakTime: number; // temps réel de pause en minutes
	startTime: Date;
	endTime: Date;
	date: string; // format YYYY-MM-DD pour groupement
	isCompleted: boolean; // session terminée ou arrêtée
}

export interface DailyStats {
	date: string;
	totalSessions: number;
	totalWorkTime: number; // en minutes
	totalBreakTime: number;
	completedSessions: number;
	methods: {
		[methodName: string]: {
			count: number;
			workTime: number;
		};
	};
}
