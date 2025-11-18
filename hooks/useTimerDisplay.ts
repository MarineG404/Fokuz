import { useTimerContext } from "@/contexts/TimerContext";
import { TimerPhase } from "@/utils/useTimer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export interface TimerDisplayState {
	timeLeft: number;
	phase: TimerPhase;
	isRunning: boolean;
	methodName: string;
	methodId: string;
}

/**
 * Hook to display real-time timer information
 * Calculates time left based on saved timestamp in AsyncStorage
 */
export const useTimerDisplay = () => {
	const { timerState } = useTimerContext();
	const [displayState, setDisplayState] = useState<TimerDisplayState | null>(null);
	const [, forceUpdate] = useState(0);

	const calculateTimeLeft = useCallback(async () => {
		// Check if there's a timer session (running or paused)
		if (
			!timerState.current ||
			timerState.current.phase === "finished" ||
			timerState.current.timeLeft <= 0
		) {
			return null;
		}

		// Check if there's an active timer in AsyncStorage
		const savedStartTime = await AsyncStorage.getItem("timerStartTime");
		const savedPhase = await AsyncStorage.getItem("timerPhase");
		const savedDuration = await AsyncStorage.getItem("timerDuration");

		// If running and has AsyncStorage data, calculate from timestamp
		if (timerState.current.isRunning && savedStartTime && savedPhase && savedDuration) {
			const startTime = parseInt(savedStartTime);
			const duration = parseInt(savedDuration);
			const now = Date.now();
			const elapsed = Math.floor((now - startTime) / 1000);
			const remaining = Math.max(0, duration - elapsed);

			if (remaining > 0) {
				return {
					timeLeft: remaining,
					phase: savedPhase as TimerPhase,
					isRunning: true,
					methodName: timerState.current.methodName || "Timer",
					methodId: timerState.current.methodId || "custom",
				};
			}
		}

		// Return context state (works for both running and paused)
		return {
			timeLeft: timerState.current.timeLeft,
			phase: timerState.current.phase,
			isRunning: timerState.current.isRunning,
			methodName: timerState.current.methodName || "Timer",
			methodId: timerState.current.methodId || "custom",
		};
	}, [timerState]);

	const updateDisplay = useCallback(async () => {
		const state = await calculateTimeLeft();
		setDisplayState(state);
	}, [calculateTimeLeft]);

	// Update display every second when timer is active
	useEffect(() => {
		updateDisplay();

		const interval = setInterval(() => {
			updateDisplay();
			forceUpdate((n) => n + 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [updateDisplay]);

	const hasActiveSession = displayState !== null && displayState.timeLeft > 0;

	return {
		timerDisplay: displayState,
		hasActiveSession,
		refresh: updateDisplay,
	};
};
