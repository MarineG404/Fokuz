import { useThemeColors } from '@/constants/color';
import { TimerPhase } from '@/utils/useTimer';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

interface SessionCircularTimerProps {
	workDurationMinutes: number;
	breakDurationMinutes: number;
	currentPhase: TimerPhase;
	timeLeft: number;
	formattedTime: string;
	size?: number;
	strokeWidth?: number;
}

export const SessionCircularTimer: React.FC<SessionCircularTimerProps> = ({
	workDurationMinutes,
	breakDurationMinutes,
	currentPhase,
	timeLeft,
	formattedTime,
	size = 220,
	strokeWidth = 16,
}) => {
	const COLORS = useThemeColors();
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;

	// Durées en secondes
	const workDuration = workDurationMinutes * 60;
	const breakDuration = breakDurationMinutes * 60;
	const totalDuration = workDuration + breakDuration;

	// Calculer les proportions du cercle
	const workProportion = workDuration / totalDuration;
	const breakProportion = breakDuration / totalDuration;

	// Calculer la position actuelle dans le cycle complet
	let currentPosition = 0;
	if (currentPhase === 'work') {
		// Dans la phase de travail
		const workElapsed = workDuration - timeLeft;
		currentPosition = workElapsed / totalDuration;
	} else if (currentPhase === 'break') {
		// Dans la phase de pause (après le travail)
		const breakElapsed = breakDuration - timeLeft;
		currentPosition = workProportion + (breakElapsed / totalDuration);
	}

	// Paramètres SVG
	const workArcLength = circumference * workProportion;
	const breakArcLength = circumference * breakProportion;
	const currentPositionOffset = circumference * (1 - currentPosition);

	// Couleur de fond plus contrastée
	const backgroundColor = COLORS.text === '#000' ? '#D1D5DB' : '#374151';

	return (
		<View style={[styles.container, { width: size, height: size }]}>
			<Svg width={size} height={size} style={styles.svg}>
				<G rotation="270" origin={`${size / 2}, ${size / 2}`}>
					{/* Cercle de fond */}
					<Circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke={backgroundColor}
						strokeWidth={strokeWidth}
						fill="transparent"
					/>

					{/* Arc de travail */}
					<Circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke={COLORS.workColor}
						strokeWidth={strokeWidth - 2}
						strokeDasharray={`${workArcLength} ${circumference - workArcLength}`}
						strokeDashoffset={0}
						fill="transparent"
						opacity={0.6}
					/>

					{/* Arc de pause */}
					<Circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke={COLORS.breakColor}
						strokeWidth={strokeWidth - 2}
						strokeDasharray={`${breakArcLength} ${circumference - breakArcLength}`}
						strokeDashoffset={-workArcLength}
						fill="transparent"
						opacity={0.6}
					/>

					{/* Indicateur de position actuelle */}
					<Circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke="#FFFFFF"
						strokeWidth={strokeWidth + 2}
						strokeDasharray={`1 ${circumference - 1}`}
						strokeDashoffset={currentPositionOffset}
						strokeLinecap="round"
						fill="transparent"
					/>
				</G>
			</Svg>

			{/* Contenu central */}
			<View style={styles.centerContent}>
				<Text style={[styles.phaseText, { color: COLORS.text }]}>
					{currentPhase === 'work' ? 'Travail' : currentPhase === 'break' ? 'Pause' : 'Terminé'}
				</Text>
				<Text style={[styles.timerDisplay, { color: COLORS.text }]}>
					{formattedTime}
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
	},
	svg: {
		position: 'absolute',
	},
	centerContent: {
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
});
