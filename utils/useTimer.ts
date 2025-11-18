import { useTimerContext } from "@/contexts/TimerContext";
import { SessionRecord } from "@/types/session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";
import { historyService } from "./historyService";
import { soundManager } from "./soundManager";

export type TimerPhase = "work" | "break" | "finished";

export interface TimerState {
	timeLeft: number;
	isRunning: boolean;
	phase: TimerPhase;
	totalWorkTime: number;
	totalBreakTime: number;
}

export interface TimerControls {
	start: () => void;
	pause: () => void;
	resume: () => void;
	reset: () => void;
	toggle: () => void;
}

export interface UseTimerProps {
	workDurationMinutes: number;
	breakDurationMinutes?: number;
	methodName?: string;
	methodId?: string;
	onPhaseChange?: (phase: TimerPhase) => void;
	onFinish?: () => void;
}

export const useTimer = ({
	workDurationMinutes,
	breakDurationMinutes,
	methodName = "Session personnalisée",
	methodId = "custom",
	onPhaseChange,
	onFinish,
}: UseTimerProps) => {
	const { timerState, setTimerState, clearTimerState } = useTimerContext();
	const [timeLeft, setTimeLeft] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [phase, setPhase] = useState<TimerPhase>("work");
	const [sessionCount, setSessionCount] = useState(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	// Variables pour tracking de session
	const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
	const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
	const [actualWorkTime, setActualWorkTime] = useState(0); // en secondes
	const [actualBreakTime, setActualBreakTime] = useState(0); // en secondes
	const [completedCycles, setCompletedCycles] = useState(0);

	const totalWorkTime = workDurationMinutes * 60;
	const totalBreakTime = breakDurationMinutes ? breakDurationMinutes * 60 : 0;

	// Format time as MM:SS
	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	// Sauvegarder une session
	const saveSession = useCallback(
		async (isCompleted: boolean) => {
			if (!currentSessionId || !sessionStartTime) return;

			const session: SessionRecord = {
				id: currentSessionId,
				methodName,
				methodId,
				workDuration: workDurationMinutes,
				breakDuration: breakDurationMinutes,
				completedCycles,
				totalWorkTime: actualWorkTime, // en secondes
				totalBreakTime: actualBreakTime, // en secondes
				startTime: sessionStartTime,
				endTime: new Date(),
				date: new Date().toISOString().split("T")[0],
				isCompleted,
			};

			await historyService.saveSession(session);
		},
		[
			currentSessionId,
			sessionStartTime,
			methodName,
			methodId,
			workDurationMinutes,
			breakDurationMinutes,
			completedCycles,
			actualWorkTime,
			actualBreakTime,
		],
	);

	// Start timer
	const start = async () => {
		// Vibration forte pour tester
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

		// Nouvelle session
		const sessionId = historyService.generateSessionId();
		setCurrentSessionId(sessionId);
		setSessionStartTime(new Date());
		setActualWorkTime(0);
		setActualBreakTime(0);
		setCompletedCycles(0);

		setTimeLeft(totalWorkTime);
		setPhase("work");
		setIsRunning(true);
		setSessionCount((prev) => prev + 1);
		onPhaseChange?.("work");
		await AsyncStorage.setItem("timer", "true");
	};

	// Restart timer (nouvelle session)
	const restart = () => {
		// Sauvegarder la session précédente si elle existe
		if (currentSessionId) {
			saveSession(false);
		}

		// Vibration forte pour tester
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

		// Nouvelle session
		const sessionId = historyService.generateSessionId();
		setCurrentSessionId(sessionId);
		setSessionStartTime(new Date());
		setActualWorkTime(0);
		setActualBreakTime(0);
		setCompletedCycles(0);

		setTimeLeft(totalWorkTime);
		setPhase("work");
		setIsRunning(true);
		setSessionCount((prev) => prev + 1);
		onPhaseChange?.("work");
	};

	// Pause timer
	const pause = () => {
		setIsRunning(false);
	};

	// Resume timer
	const resume = () => {
		setIsRunning(true);
	};

	// Toggle pause/resume
	const toggle = () => {
		setIsRunning(!isRunning);
	};

	// Reset timer
	const reset = () => {
		// Sauvegarder la session si elle existe
		if (currentSessionId) {
			saveSession(false); 
		}

		setIsRunning(false);
		setTimeLeft(0);
		setPhase("work");
		setSessionCount(0);
		setCurrentSessionId(null);
		setSessionStartTime(null);
		setActualWorkTime(0);
		setActualBreakTime(0);
		setCompletedCycles(0);

		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
	};

	// Au montage, restaurer l'état si existant
	useEffect(() => {
		if (timerState.current) {
			if (timerState.current.phase === "finished" || timerState.current.timeLeft <= 0) {
				clearTimerState();
			} else {
				setTimeLeft(timerState.current.timeLeft);
				setPhase(timerState.current.phase);
				setIsRunning(timerState.current.isRunning);
				clearTimerState();
			}
		}
	}, [timerState, clearTimerState]);

	// Sauvegarder l'état à chaque tick
	useEffect(() => {
		setTimerState({
			timeLeft,
			phase,
			isRunning,
			workDurationMinutes,
			breakDurationMinutes,
			methodName,
			methodId,
		});
	}, [
		setTimerState,
		timeLeft,
		phase,
		isRunning,
		workDurationMinutes,
		breakDurationMinutes,
		methodName,
		methodId,
	]);

	// Dans useTimer, après les autres useEffect, ajoutez celui-ci :

	// Écouter si le contexte a été vidé depuis l'extérieur
	useEffect(() => {
		if (!timerState.current && isRunning) {
			// Le contexte a été vidé, on doit arrêter le timer local
			setIsRunning(false);
			setTimeLeft(0);
			setPhase("work");
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		}
	}, [timerState, isRunning]);

	// Timer logic
	useEffect(() => {
		if (isRunning && timeLeft > 0) {
			intervalRef.current = setInterval(() => {
				// Tracker le temps réel
				if (phase === "work") {
					setActualWorkTime((prev) => prev + 1);
				} else if (phase === "break") {
					setActualBreakTime((prev) => prev + 1);
				}

				setTimeLeft((prev) => {
					if (prev <= 1) {
						// Timer finished
						if (phase === "work" && breakDurationMinutes) {
							// Work phase finished - auto-switch to break
							setCompletedCycles((prev) => prev + 1);
							soundManager.playTransitionSound();
							setPhase("break");
							onPhaseChange?.("break");
							return totalBreakTime;
						} else {
							// Break finished or no break - stop timer
							if (phase === "break") {
								setCompletedCycles((prev) => prev + 1);
							}

							// Session terminée avec succès
							saveSession(true);

							soundManager.playFinishSound();
							setIsRunning(false);
							setPhase("finished");
							onPhaseChange?.("finished");
							onFinish?.();
							return 0;
						}
					}
					return prev - 1;
				});
			}, 1000);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [
		isRunning,
		timeLeft,
		phase,
		totalBreakTime,
		breakDurationMinutes,
		onPhaseChange,
		onFinish,
		saveSession,
	]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	const state: TimerState = {
		timeLeft,
		isRunning,
		phase,
		totalWorkTime,
		totalBreakTime,
	};

	const controls: TimerControls = {
		start,
		pause,
		resume,
		reset,
		toggle,
	};

	return {
		...state,
		...controls,
		restart,
		sessionCount,
		formatTime,
		formattedTime: formatTime(timeLeft),
		saveSession, // Ajouté pour accès externe
	};
};
