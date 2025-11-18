import { useTimerContext } from "@/contexts/TimerContext";
import { TimerPhase } from "@/utils/useTimer";

export interface TimerDisplayState {
	timeLeft: number;
	phase: TimerPhase;
	isRunning: boolean;
	methodName: string;
	methodId: string;
	formattedTime: string;
}

/**
 * Hook simplifié pour afficher le timer en temps réel
 * Utilise directement le contexte qui gère déjà le calcul en temps réel
 */
export const useTimerDisplay = () => {
	const { timerState, getCurrentTimeLeft, getFormattedTime } = useTimerContext();

	if (!timerState) {
		return {
			timerDisplay: null,
			hasActiveSession: false,
			refresh: () => { }, // No-op
		};
	}

	const timeLeft = getCurrentTimeLeft();

	const displayState: TimerDisplayState = {
		timeLeft,
		phase: timerState.phase,
		isRunning: timerState.isRunning,
		methodName: timerState.methodName || "Timer",
		methodId: timerState.methodId || "custom",
		formattedTime: getFormattedTime(),
	};

	return {
		timerDisplay: displayState,
		hasActiveSession: timeLeft > 0 || timerState.isRunning,
		refresh: () => { }, // No-op since context handles real-time updates
	};
};
