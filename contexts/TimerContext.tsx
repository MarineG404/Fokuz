import { historyService } from "@/utils/historyService";
import { TimerPhase } from "@/utils/useTimer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface TimerPersistState {
	sessionId: string;
	phase: TimerPhase;
	isRunning: boolean;
	workDurationMinutes: number;
	breakDurationMinutes?: number;
	methodName?: string;
	methodId?: string;
	actualWorkTime: number; // secondes écoulées dans work
	actualBreakTime: number; // secondes écoulées dans break
	completedCycles: number;
	sessionStartTime: number; // timestamp
	phaseStartTime: number; // timestamp du début de la phase actuelle
	pausedTimeLeft?: number; // temps restant quand le timer est en pause
}

interface TimerContextType {
	timerState: TimerPersistState | null;
	setTimerState: (state: TimerPersistState | null) => void;
	getCurrentTimeLeft: () => number;
	getFormattedTime: () => string;
	clearTimerState: () => Promise<void>;
	saveCurrentSession: (isCompleted: boolean) => Promise<void>;
}

const TIMER_STATE_KEY = "@fokuz/timer_state";
const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [timerState, setTimerStateInternal] = useState<TimerPersistState | null>(null);
	const [, forceUpdate] = useState(0);

	// Charger l'état du timer au démarrage
	useEffect(() => {
		(async () => {
			try {
				const data = await AsyncStorage.getItem(TIMER_STATE_KEY);
				if (data) {
					const parsed: TimerPersistState = JSON.parse(data);
					setTimerStateInternal(parsed);
				}
			} catch {
				// ignore
			}
		})();
	}, []);

	// Persister à chaque changement
	const setTimerState = async (state: TimerPersistState | null) => {
		setTimerStateInternal(state);
		if (state) {
			await AsyncStorage.setItem(TIMER_STATE_KEY, JSON.stringify(state));
		} else {
			await AsyncStorage.removeItem(TIMER_STATE_KEY);
		}
	};

	// Clear timer state
	const clearTimerState = async () => {
		setTimerStateInternal(null);
		await AsyncStorage.removeItem(TIMER_STATE_KEY);
		// Also clear timer timestamps from AsyncStorage
		await AsyncStorage.removeItem("timerStartTime");
		await AsyncStorage.removeItem("timerPhase");
		await AsyncStorage.removeItem("timerDuration");
	};

	// Save current session to history
	const saveCurrentSession = async (isCompleted: boolean) => {
		if (!timerState) return;

		const now = Date.now();
		const totalWorkTime = Math.floor((now - timerState.sessionStartTime) / 1000); // Total time in work phase

		await historyService.saveSession({
			id: timerState.sessionId,
			methodName: timerState.methodName || "Timer",
			methodId: timerState.methodId || "custom",
			workDuration: timerState.workDurationMinutes,
			breakDuration: timerState.breakDurationMinutes,
			completedCycles: timerState.completedCycles,
			totalWorkTime: timerState.actualWorkTime,
			totalBreakTime: timerState.actualBreakTime,
			startTime: new Date(timerState.sessionStartTime),
			endTime: new Date(),
			date: new Date().toISOString().split("T")[0],
			isCompleted,
		});
	};

	// Calculer le temps restant en temps réel
	const getCurrentTimeLeft = (): number => {
		if (!timerState) {
			return 0;
		}

		// If paused, return saved timeLeft
		if (!timerState.isRunning && timerState.pausedTimeLeft !== undefined) {
			return timerState.pausedTimeLeft;
		}

		// If running, calculate from timestamp
		if (timerState.isRunning) {
			const now = Date.now();
			const phaseDuration =
				timerState.phase === "work"
					? timerState.workDurationMinutes * 60
					: (timerState.breakDurationMinutes || 0) * 60;

			const elapsed = Math.floor((now - timerState.phaseStartTime) / 1000);
			return Math.max(0, phaseDuration - elapsed);
		}

		return 0;
	};

	// Formater le temps
	const getFormattedTime = (): string => {
		const seconds = getCurrentTimeLeft();
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	// Force update toutes les secondes si timer actif
	useEffect(() => {
		if (!timerState?.isRunning) return;

		const interval = setInterval(() => {
			forceUpdate((n) => n + 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [timerState?.isRunning]);

	return (
		<TimerContext.Provider
			value={{
				timerState,
				setTimerState,
				getCurrentTimeLeft,
				getFormattedTime,
				clearTimerState,
				saveCurrentSession,
			}}
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
