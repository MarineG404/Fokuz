import { useTimerContext } from "@/contexts/TimerContext";
import { SessionRecord } from "@/types/session";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";
import { historyService } from "./historyService";
import { NotificationService } from "./notificationService";
import { soundManager } from "./soundManager";

export type TimerPhase = "work" | "break" | "finished";

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
	const { timerState, setTimerState, getCurrentTimeLeft, getFormattedTime } = useTimerContext();
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const [sessionCount, setSessionCount] = useState(0);

	// Calculer timeLeft et phase depuis le contexte
	const timeLeft = timerState ? getCurrentTimeLeft() : 0;
	const phase = timerState?.phase || "work";
	const isRunning = timerState?.isRunning || false;
	const formattedTime = timerState ? getFormattedTime() : "00:00";

	// Sauvegarder une session
	const saveSession = useCallback(
		async (isCompleted: boolean) => {
			if (!timerState) return;

			const session: SessionRecord = {
				id: timerState.sessionId,
				methodName,
				methodId,
				workDuration: workDurationMinutes,
				breakDuration: breakDurationMinutes,
				completedCycles: timerState.completedCycles,
				totalWorkTime: timerState.actualWorkTime,
				totalBreakTime: timerState.actualBreakTime,
				startTime: new Date(timerState.sessionStartTime),
				endTime: new Date(),
				date: new Date().toISOString().split("T")[0],
				isCompleted,
			};

			await historyService.saveSession(session);
		},
		[timerState, methodName, methodId, workDurationMinutes, breakDurationMinutes],
	);

	// Démarrer le timer
	const start = async () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

		const now = Date.now();
		await setTimerState({
			sessionId: historyService.generateSessionId(),
			phase: "work",
			isRunning: true,
			workDurationMinutes,
			breakDurationMinutes,
			methodName,
			methodId,
			actualWorkTime: 0,
			actualBreakTime: 0,
			completedCycles: 0,
			sessionStartTime: now,
			phaseStartTime: now,
		});

		setSessionCount((prev) => prev + 1);
		onPhaseChange?.("work");

		NotificationService.showTimerNotification(
			methodName,
			"work",
			workDurationMinutes * 60,
			true,
			true,
		);
	};

	// Redémarrer (nouvelle session)
	const restart = async () => {
		if (timerState) {
			await saveSession(false);
		}
		await start();
	};

	// Pause
	const pause = async () => {
		if (!timerState) return;

		// Calculer le temps écoulé dans la phase actuelle
		const now = Date.now();
		const elapsed = Math.floor((now - timerState.phaseStartTime) / 1000);
		const currentTimeLeft = getCurrentTimeLeft();

		await setTimerState({
			...timerState,
			isRunning: false,
			pausedTimeLeft: currentTimeLeft, // Save time left when pausing
			actualWorkTime:
				timerState.phase === "work"
					? timerState.actualWorkTime + elapsed
					: timerState.actualWorkTime,
			actualBreakTime:
				timerState.phase === "break"
					? timerState.actualBreakTime + elapsed
					: timerState.actualBreakTime,
		});

		NotificationService.clearTimerNotification();
	};

	// Reprendre
	const resume = async () => {
		if (!timerState) return;

		const now = Date.now();
		const currentTimeLeft = getCurrentTimeLeft();

		// Calculer le nouveau phaseStartTime pour que le temps restant soit correct
		const phaseDuration =
			timerState.phase === "work" ? workDurationMinutes * 60 : (breakDurationMinutes || 0) * 60;
		const elapsed = phaseDuration - currentTimeLeft;
		const newPhaseStartTime = now - elapsed * 1000;

		await setTimerState({
			...timerState,
			isRunning: true,
			phaseStartTime: newPhaseStartTime,
		});

		NotificationService.showTimerNotification(
			methodName,
			timerState.phase,
			currentTimeLeft,
			true,
			true,
		);
	};

	// Toggle pause/resume
	const toggle = () => {
		if (isRunning) {
			pause();
		} else {
			resume();
		}
	};

	// Reset
	const reset = async () => {
		if (timerState) {
			await saveSession(false);
		}

		await setTimerState(null);
		setSessionCount(0);
		NotificationService.clearTimerNotification();

		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
	};

	// Logique du timer - vérifier toutes les secondes
	useEffect(() => {
		if (!timerState?.isRunning) {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			return;
		}

		intervalRef.current = setInterval(async () => {
			const now = Date.now();
			const elapsed = Math.floor((now - timerState.phaseStartTime) / 1000);
			const phaseDuration =
				timerState.phase === "work" ? workDurationMinutes * 60 : (breakDurationMinutes || 0) * 60;
			const remaining = Math.max(0, phaseDuration - elapsed);

			// Mettre à jour les temps écoulés
			const updatedState = {
				...timerState,
				actualWorkTime:
					timerState.phase === "work" ? timerState.actualWorkTime + 1 : timerState.actualWorkTime,
				actualBreakTime:
					timerState.phase === "break"
						? timerState.actualBreakTime + 1
						: timerState.actualBreakTime,
			};

			// Update notification
			NotificationService.showTimerNotification(methodName, timerState.phase, remaining, true);

			if (remaining <= 0) {
				// Phase terminée
				if (timerState.phase === "work" && breakDurationMinutes) {
					// Passer en pause
					soundManager.playTransitionSound();
					const breakStartTime = Date.now();

					await setTimerState({
						...updatedState,
						phase: "break",
						completedCycles: timerState.completedCycles + 1,
						phaseStartTime: breakStartTime,
					});

					onPhaseChange?.("break");
					NotificationService.showTimerEvent(
						"TIMER.NOTIFICATIONS.WORK_FINISHED",
						"TIMER.NOTIFICATIONS.START_BREAK",
					);
				} else {
					// Session terminée
					soundManager.playFinishSound();

					await saveSession(true);
					await setTimerState(null);

					onPhaseChange?.("finished");
					onFinish?.();

					NotificationService.showTimerEvent(
						"TIMER.NOTIFICATIONS.SESSION_COMPLETE",
						"TIMER.NOTIFICATIONS.GREAT_WORK",
					);
					NotificationService.clearTimerNotification();
				}
			} else {
				// Mettre à jour l'état avec les nouveaux temps écoulés
				await setTimerState(updatedState);
			}
		}, 1000);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [
		timerState,
		workDurationMinutes,
		breakDurationMinutes,
		methodName,
		onPhaseChange,
		onFinish,
		saveSession,
		setTimerState,
	]);

	return {
		timeLeft,
		isRunning,
		phase,
		formattedTime,
		sessionCount,
		start,
		pause,
		resume,
		toggle,
		reset,
		restart,
		saveSession,
		totalWorkTime: workDurationMinutes * 60,
		totalBreakTime: breakDurationMinutes ? breakDurationMinutes * 60 : 0,
		formatTime: (seconds: number) => {
			const minutes = Math.floor(seconds / 60);
			const remainingSeconds = seconds % 60;
			return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
		},
	};
};
