import { TimerPhase } from "@/utils/useTimer";
import React, { createContext, useContext, useRef } from "react";

export interface TimerPersistState {
	timeLeft: number;
	phase: TimerPhase;
	isRunning: boolean;
	workDurationMinutes: number;
	breakDurationMinutes?: number;
	methodName?: string;
	methodId?: string;
}

interface TimerContextType {
	timerState: React.MutableRefObject<TimerPersistState | null>;
	setTimerState: (state: TimerPersistState) => void;
	clearTimerState: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const timerState = useRef<TimerPersistState | null>(null);

	const setTimerState = (state: TimerPersistState) => {
		timerState.current = state;
	};

	const clearTimerState = () => {
		timerState.current = null;
	};

	return (
		<TimerContext.Provider value={{ timerState, setTimerState, clearTimerState }}>
			{children}
		</TimerContext.Provider>
	);
};

export const useTimerContext = () => {
	const context = useContext(TimerContext);
	if (!context) throw new Error("useTimerContext must be used within TimerProvider");
	return context;
};
