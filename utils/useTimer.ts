import { useTimerContext } from "@/contexts/TimerContext";
import { SessionRecord } from "@/types/session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { historyService } from "./historyService";
import { NotificationService } from "./notificationService";
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

	// Session tracking variables
	const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
	const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
	const [actualWorkTime, setActualWorkTime] = useState(0); // in seconds
	const [actualBreakTime, setActualBreakTime] = useState(0); // in seconds
	const [completedCycles, setCompletedCycles] = useState(0);
	const lastUpdateTime = useRef<number>(Date.now());
	const timerStartTime = useRef<number | null>(null);
	const phaseStartTime = useRef<number | null>(null);
	const backgroundTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const totalWorkTime = workDurationMinutes * 60;
	const totalBreakTime = breakDurationMinutes ? breakDurationMinutes * 60 : 0;

	// Format time as MM:SS
	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	// Save a session
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
				totalWorkTime: actualWorkTime, // in seconds
				totalBreakTime: actualBreakTime, // in seconds
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
		// Strong vibration for feedback
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

		// New session
		const sessionId = historyService.generateSessionId();
		setCurrentSessionId(sessionId);
		setSessionStartTime(new Date());
		setActualWorkTime(0);
		setActualBreakTime(0);
		setCompletedCycles(0);

		const now = Date.now();
		timerStartTime.current = now;
		phaseStartTime.current = now;

		setTimeLeft(totalWorkTime);
		setPhase("work");
		setIsRunning(true);
		setSessionCount((prev) => prev + 1);
		onPhaseChange?.("work");
		await AsyncStorage.setItem("timer", "true");
		await AsyncStorage.setItem("timerStartTime", now.toString());
		await AsyncStorage.setItem("timerPhase", "work");
		await AsyncStorage.setItem("timerDuration", totalWorkTime.toString());

		// Show initial notification
		NotificationService.showTimerNotification(methodName, "work", totalWorkTime, true, true);
	};

	// Restart timer (new session)
	const restart = () => {
		// Save previous session if it exists
		if (currentSessionId) {
			saveSession(false);
		}

		// Strong vibration for feedback
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

		// New session
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
		NotificationService.clearTimerNotification();
		AsyncStorage.removeItem("timerStartTime");
		AsyncStorage.removeItem("timerPhase");
		AsyncStorage.removeItem("timerDuration");
	};

	// Resume timer
	const resume = async () => {
		setIsRunning(true);
		const now = Date.now();
		phaseStartTime.current = now;
		await AsyncStorage.setItem("timerStartTime", now.toString());
		await AsyncStorage.setItem("timerPhase", phase);
		await AsyncStorage.setItem("timerDuration", timeLeft.toString());

		// Force notification update when resuming
		NotificationService.showTimerNotification(methodName, phase, timeLeft, true, true);
		// Notification will be created in the timer useEffect
	};

	// Toggle pause/resume
	const toggle = () => {
		setIsRunning(!isRunning);
	};

	// Reset timer
	const reset = () => {
		// Save session if it exists
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

		// Clear notification
		NotificationService.clearTimerNotification();

		// Clear AsyncStorage
		AsyncStorage.removeItem("timerStartTime");
		AsyncStorage.removeItem("timerPhase");
		AsyncStorage.removeItem("timerDuration");
	};

	// On mount, restore state if exists
	useEffect(() => {
		const restoreTimer = async () => {
			// First check context state
			if (timerState.current) {
				if (timerState.current.phase === "finished" || timerState.current.timeLeft <= 0) {
					clearTimerState();
				} else {
					// Restore from context
					setTimeLeft(timerState.current.timeLeft);
					setPhase(timerState.current.phase);
					setIsRunning(timerState.current.isRunning);

					// Only restore timestamps if timer is running
					if (timerState.current.isRunning) {
						const savedStartTime = await AsyncStorage.getItem("timerStartTime");
						if (savedStartTime) {
							phaseStartTime.current = parseInt(savedStartTime);
							timerStartTime.current = parseInt(savedStartTime);
						}
					}

					clearTimerState();
					return;
				}
			}

			// If no context, check AsyncStorage for running timer
			const savedStartTime = await AsyncStorage.getItem("timerStartTime");
			const savedPhase = await AsyncStorage.getItem("timerPhase");
			const savedDuration = await AsyncStorage.getItem("timerDuration");

			if (savedStartTime && savedPhase && savedDuration) {
				const startTime = parseInt(savedStartTime);
				const duration = parseInt(savedDuration);
				const now = Date.now();
				const elapsed = Math.floor((now - startTime) / 1000);
				const remaining = Math.max(0, duration - elapsed);

				if (remaining > 0) {
					setTimeLeft(remaining);
					setPhase(savedPhase as TimerPhase);
					setIsRunning(true);
					phaseStartTime.current = startTime;
					timerStartTime.current = startTime;
				} else {
					// Timer expired while app was closed
					await AsyncStorage.removeItem("timerStartTime");
					await AsyncStorage.removeItem("timerPhase");
					await AsyncStorage.removeItem("timerDuration");
				}
			}
		};

		restoreTimer();

		// Request notification permissions on mount
		NotificationService.requestPermissions();
	}, [timerState, clearTimerState]); // Save state on each tick
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

	// Listen if context was cleared from outside
	useEffect(() => {
		if (!timerState.current && isRunning) {
			// Context was cleared, must stop local timer
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
				// Track actual time
				if (phase === "work") {
					setActualWorkTime((prev) => prev + 1);
				} else if (phase === "break") {
					setActualBreakTime((prev) => prev + 1);
				}

				setTimeLeft((prev) => {
					const newTimeLeft = prev - 1;

					// Update notification
					NotificationService.showTimerNotification(methodName, phase, newTimeLeft, true);

					if (newTimeLeft <= 0) {
						// Timer finished
						if (phase === "work" && breakDurationMinutes) {
							// Work phase finished - auto-switch to break
							setCompletedCycles((prev) => prev + 1);
							soundManager.playTransitionSound();
							setPhase("break");
							onPhaseChange?.("break");

							// Transition notification
							NotificationService.showTimerEvent(
								"TIMER.NOTIFICATIONS.WORK_FINISHED",
								"TIMER.NOTIFICATIONS.START_BREAK",
							);

							return totalBreakTime;
						} else {
							// Break finished or no break - stop timer
							if (phase === "break") {
								setCompletedCycles((prev) => prev + 1);
							}

							// Session completed successfully
							saveSession(true);

							soundManager.playFinishSound();
							setIsRunning(false);
							setPhase("finished");
							onPhaseChange?.("finished");
							onFinish?.();

							// Completion notification
							NotificationService.showTimerEvent(
								"TIMER.NOTIFICATIONS.SESSION_COMPLETE",
								"TIMER.NOTIFICATIONS.GREAT_WORK",
							);
							NotificationService.clearTimerNotification();

							return 0;
						}
					}
					return newTimeLeft;
				});
			}, 1000);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			// Clear notification when timer is paused
			if (!isRunning) {
				NotificationService.clearTimerNotification();
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
		methodName,
	]);

	// Handle app state changes (background/foreground)
	useEffect(() => {
		const handleAppStateChange = async (nextAppState: AppStateStatus) => {
			if (nextAppState === "background" && isRunning) {
				// App goes to background, save current time
				lastUpdateTime.current = Date.now();

				// Schedule notification for when timer will end
				if (phaseStartTime.current) {
					const endTime = phaseStartTime.current + timeLeft * 1000;
					const now = Date.now();
					const timeUntilEnd = Math.max(0, endTime - now);

					// Schedule a notification for when the timer ends
					if (timeUntilEnd > 0 && timeUntilEnd < 24 * 60 * 60 * 1000) {
						// max 24h
						await NotificationService.scheduleTimerEndNotification(phase, timeUntilEnd);
					}
				}
			} else if (nextAppState === "active" && isRunning) {
				// App returns to foreground, calculate elapsed time

				// Cancel scheduled notifications
				await NotificationService.cancelScheduledNotifications();

				const savedStartTime = await AsyncStorage.getItem("timerStartTime");
				if (savedStartTime && phaseStartTime.current) {
					const now = Date.now();
					const elapsed = Math.floor((now - phaseStartTime.current) / 1000);

					if (elapsed > 0) {
						// Update remaining time based on elapsed time
						setTimeLeft((prev) => {
							const newTimeLeft = Math.max(0, prev - elapsed);

							// If time elapsed while in background
							if (newTimeLeft === 0 && prev > 0) {
								if (phase === "work" && breakDurationMinutes) {
									// Transition to break
									setPhase("break");
									onPhaseChange?.("break");
									soundManager.playTransitionSound();
									setCompletedCycles((prev) => prev + 1);

									// Update storage for new phase
									phaseStartTime.current = now;
									AsyncStorage.setItem("timerStartTime", now.toString());
									AsyncStorage.setItem("timerPhase", "break");
									AsyncStorage.setItem("timerDuration", totalBreakTime.toString());

									return totalBreakTime;
								} else {
									// Session completed
									if (phase === "break") {
										setCompletedCycles((prev) => prev + 1);
									}
									saveSession(true);
									soundManager.playFinishSound();
									setIsRunning(false);
									setPhase("finished");
									onPhaseChange?.("finished");
									onFinish?.();
									NotificationService.clearTimerNotification();

									// Clear storage
									AsyncStorage.removeItem("timerStartTime");
									AsyncStorage.removeItem("timerPhase");
									AsyncStorage.removeItem("timerDuration");

									return 0;
								}
							}

							return newTimeLeft;
						});

						// Update elapsed work/break time
						if (phase === "work") {
							setActualWorkTime((prev) => prev + elapsed);
						} else if (phase === "break") {
							setActualBreakTime((prev) => prev + elapsed);
						}
					}
				}

				lastUpdateTime.current = Date.now();
			}
		};

		const subscription = AppState.addEventListener("change", handleAppStateChange);

		return () => {
			subscription?.remove();
		};
	}, [
		isRunning,
		phase,
		breakDurationMinutes,
		totalBreakTime,
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
		saveSession, // Added for external access
	};
};
