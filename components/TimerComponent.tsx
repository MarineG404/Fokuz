import { useThemeColors } from '@/constants/color';
import { TimerPhase, useTimer } from '@/utils/useTimer';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TimerComponentProps {
	workDurationMinutes: number;
	breakDurationMinutes?: number;
	onPhaseChange?: (phase: TimerPhase) => void;
	onFinish?: () => void;
}

const getPhaseLabel = (phase: TimerPhase): string => {
	switch (phase) {
		case 'work': return 'Travail';
		case 'break': return 'Pause';
		case 'finished': return 'Terminé';
		default: return '';
	}
};

export const TimerComponent: React.FC<TimerComponentProps> = ({
	workDurationMinutes,
	breakDurationMinutes,
	onPhaseChange,
	onFinish,
}) => {
	const COLORS = useThemeColors();
	const timer = useTimer({
		workDurationMinutes,
		breakDurationMinutes,
		onPhaseChange,
		onFinish,
	});

	return (
		<View style={styles.container}>
			<Text style={[styles.sectionTitle, { color: COLORS.primary }]}>Minuteur</Text>

			{timer.timeLeft > 0 && (
				<>
					<Text style={[styles.phaseText, { color: COLORS.text }]}>
						{getPhaseLabel(timer.phase)}
					</Text>
					<Text style={[styles.timerDisplay, { color: COLORS.primary }]}>
						{timer.formattedTime}
					</Text>
				</>
			)}

			<View style={styles.buttonRow}>
				{timer.timeLeft === 0 ? (
					<TouchableOpacity
						style={[styles.button, { backgroundColor: COLORS.primary }]}
						onPress={timer.start}
					>
						<Text style={styles.buttonText}>Commencer</Text>
					</TouchableOpacity>
				) : (
					<>
						<TouchableOpacity
							style={[styles.button, { backgroundColor: timer.isRunning ? COLORS.secondary : COLORS.primary }]}
							onPress={timer.toggle}
						>
							<Text style={styles.buttonText}>
								{timer.isRunning ? 'Pause' : 'Reprendre'}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.button, styles.resetButton, { borderColor: COLORS.primary }]}
							onPress={timer.reset}
						>
							<Text style={[styles.buttonText, { color: COLORS.primary }]}>Reset</Text>
						</TouchableOpacity>
					</>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
		alignItems: 'center',
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 16,
	},
	phaseText: {
		fontSize: 18,
		fontWeight: '500',
		marginBottom: 8,
	},
	timerDisplay: {
		fontSize: 48,
		fontWeight: 'bold',
		marginBottom: 20,
		fontFamily: 'monospace',
	},
	buttonRow: {
		flexDirection: 'row',
		gap: 12,
	},
	button: {
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
		minWidth: 100,
		alignItems: 'center',
	},
	resetButton: {
		backgroundColor: 'transparent',
		borderWidth: 2,
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
	},
});
