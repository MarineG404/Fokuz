import { useThemeColors } from '@/constants/color';
import { TimerPhase, useTimer } from '@/utils/useTimer';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CircularTimer } from './CircularTimer';

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

	// Calculer le progrès du minuteur
	const totalDuration = timer.phase === 'work'
		? workDurationMinutes * 60
		: (breakDurationMinutes || 5) * 60;
	const progress = timer.timeLeft > 0 ? (totalDuration - timer.timeLeft) / totalDuration : 0;

	// Couleur selon la phase
	const circleColor = timer.phase === 'work' ? COLORS.workColor : COLORS.breakColor;
	// Couleur de fond adaptée au thème
	const backgroundColor = COLORS.text === '#000'
		? '#D1D5DB'  // Gris plus foncé en mode clair
		: COLORS.textSecondary + '60'; // Plus d'opacité en mode sombre

	return (
		<View style={styles.container}>
			<Text style={[styles.sectionTitle, { color: COLORS.primary }]}>Minuteur</Text>

			{timer.timeLeft > 0 ? (
				<View style={styles.timerContainer}>
					<CircularTimer
						progress={progress}
						color={circleColor}
						size={220}
						strokeWidth={16}
						backgroundColor={backgroundColor}
					/>
					<View style={styles.timerContent}>
						<Text style={[styles.phaseText, { color: COLORS.text }]}>
							{getPhaseLabel(timer.phase)}
						</Text>
						<Text style={[styles.timerDisplay, { color: COLORS.text }]}>
							{timer.formattedTime}
						</Text>
					</View>
				</View>
			) : (
				<View style={styles.readyContainer}>
					<Text style={[styles.readyText, { color: COLORS.text }]}>
						Prêt à commencer !
					</Text>
				</View>
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
	timerContainer: {
		position: 'relative',
		marginBottom: 30,
		alignItems: 'center',
		justifyContent: 'center',
	},
	timerContent: {
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
	},
	phaseText: {
		fontSize: 16,
		fontWeight: '500',
		marginBottom: 8,
		textAlign: 'center',
	},
	timerDisplay: {
		fontSize: 32,
		fontWeight: 'bold',
		fontFamily: 'monospace',
		textAlign: 'center',
	},
	readyContainer: {
		height: 220,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 30,
	},
	readyText: {
		fontSize: 18,
		fontWeight: '500',
		textAlign: 'center',
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
