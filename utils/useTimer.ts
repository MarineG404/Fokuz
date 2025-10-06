import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { soundManager } from './soundManager';

export type TimerPhase = 'work' | 'break' | 'finished';

export interface TimerState {
	timeLeft: number; // en secondes
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
	onPhaseChange?: (phase: TimerPhase) => void;
	onFinish?: () => void;
}

export const useTimer = ({
	workDurationMinutes,
	breakDurationMinutes,
	onPhaseChange,
	onFinish
}: UseTimerProps) => {
	const [timeLeft, setTimeLeft] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [phase, setPhase] = useState<TimerPhase>('work');
	const [sessionCount, setSessionCount] = useState(0);
	const intervalRef = useRef<number | null>(null);

	const totalWorkTime = workDurationMinutes * 60;
	const totalBreakTime = breakDurationMinutes ? breakDurationMinutes * 60 : 0;

	// Format time as MM:SS
	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	// Start timer
	const start = () => {
		// Vibration forte pour tester
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

		setTimeLeft(totalWorkTime);
		setPhase('work');
		setIsRunning(true);
		setSessionCount(prev => prev + 1);
		onPhaseChange?.('work');
	};

	// Restart timer (nouvelle session)
	const restart = () => {
		// Vibration forte pour tester
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

		setTimeLeft(totalWorkTime);
		setPhase('work');
		setIsRunning(true);
		setSessionCount(prev => prev + 1);
		onPhaseChange?.('work');
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
		setIsRunning(false);
		setTimeLeft(0);
		setPhase('work');
		setSessionCount(0);
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
	};

	// Timer logic
	useEffect(() => {
		if (isRunning && timeLeft > 0) {
			intervalRef.current = setInterval(() => {
				setTimeLeft(prev => {
					if (prev <= 1) {
						// Timer finished
						if (phase === 'work' && breakDurationMinutes) {
							// Work phase finished - auto-switch to break
							soundManager.playTransitionSound();
							setPhase('break');
							onPhaseChange?.('break');
							return totalBreakTime;
						} else {
							// Break finished or no break - stop timer
							soundManager.playFinishSound();
							setIsRunning(false);
							setPhase('finished');
							onPhaseChange?.('finished');
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
	}, [isRunning, timeLeft, phase, totalBreakTime, breakDurationMinutes, onPhaseChange, onFinish]);

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
	};
};
