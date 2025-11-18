import { historyService } from "@/utils/historyService";
import { TimerPhase } from "@/utils/useTimer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useRef } from "react";

export interface TimerPersistState {
	timeLeft: number;
	phase: TimerPhase;
	isRunning: boolean;
	workDurationMinutes: number;
	breakDurationMinutes?: number;
	methodName?: string;
	methodId?: string;
	actualWorkTime?: number;
	actualBreakTime?: number;
	completedCycles?: number;
	startTime?: Date;
}

interface TimerContextType {
	timerState: React.MutableRefObject<TimerPersistState | null>;
	setTimerState: (state: TimerPersistState) => void;
	clearTimerState: () => void;
	saveCurrentSession: (isCompleted: boolean) => Promise<void>;
}

const TIMER_STATE_KEY = "@fokuz/timer_state";
const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const timerState = useRef<TimerPersistState | null>(null);

	// Charger l'état du timer au démarrage
	useEffect(() => {
		(async () => {
			try {
				const data = await AsyncStorage.getItem(TIMER_STATE_KEY);
				if (data) {
					const parsed = JSON.parse(data);
					// Correction des dates si présentes
					if (parsed && parsed.startTime) parsed.startTime = new Date(parsed.startTime);
					timerState.current = parsed;
				}
			} catch {
				// ignore
			}
		})();
	}, []);

	// Persister à chaque changement
	const setTimerState = (state: TimerPersistState) => {
		timerState.current = state;
		AsyncStorage.setItem(TIMER_STATE_KEY, JSON.stringify(state));
	};

	const clearTimerState = async () => {
		timerState.current = null;
		await AsyncStorage.removeItem(TIMER_STATE_KEY);
		// Also clear timer timestamps from AsyncStorage
		await AsyncStorage.removeItem("timerStartTime");
		await AsyncStorage.removeItem("timerPhase");
		await AsyncStorage.removeItem("timerDuration");
	};

	const saveCurrentSession = async (isCompleted: boolean) => {
		if (!timerState.current) return;
		const s = timerState.current;
		await historyService.saveSession({
			id: `${Date.now()}`,
			methodName: s.methodName ?? "",
			methodId: s.methodId ?? "",
			workDuration: s.workDurationMinutes,
			breakDuration: s.breakDurationMinutes,
			completedCycles: s.completedCycles || 0,
			totalWorkTime: s.actualWorkTime || s.workDurationMinutes * 60 - (s.timeLeft || 0),
			totalBreakTime: s.actualBreakTime || 0,
			startTime: s.startTime ? new Date(s.startTime) : new Date(),
			endTime: new Date(),
			date: new Date().toISOString().split("T")[0],
			isCompleted,
		});
	};

	return (
		<TimerContext.Provider
			value={{ timerState, setTimerState, clearTimerState, saveCurrentSession }}
		>
			{children}
		</TimerContext.Provider>
	);
};

export const useTimerContext = () => {
	const context = useContext(TimerContext);
	if (!context) throw new Error("useTimerContext must be used within TimerProvider");
	return context;
};
