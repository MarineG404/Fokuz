import { useThemeColors } from "@/constants/color";
import TYPOGRAPHY from "@/constants/typography";
import { TimerPhase } from "@/utils/useTimer";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

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
	const { t } = useTranslation();

	// Ajout d'un padding pour l'indicateur
	const indicatorPadding = 4;
	const radius = (size - strokeWidth - indicatorPadding * 2) / 2;
	const circumference = 2 * Math.PI * radius;

	// Animations
	const scaleAnim = useRef(new Animated.Value(1)).current;
	const pulseAnim = useRef(new Animated.Value(1)).current;
	const phaseAnim = useRef(new Animated.Value(1)).current;

	// Animation lors du changement de phase
	useEffect(() => {
		Animated.sequence([
			Animated.timing(phaseAnim, {
				toValue: 1.1,
				duration: 150,
				useNativeDriver: true,
			}),
			Animated.timing(phaseAnim, {
				toValue: 1,
				duration: 150,
				useNativeDriver: true,
			}),
		]).start();
	}, [currentPhase, phaseAnim]);

	// Animation de pulsation pour l'indicateur
	useEffect(() => {
		const pulseAnimation = Animated.loop(
			Animated.sequence([
				Animated.timing(pulseAnim, {
					toValue: 1.2,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(pulseAnim, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: true,
				}),
			]),
		);
		pulseAnimation.start();

		return () => pulseAnimation.stop();
	}, [pulseAnim]);

	// Durées en secondes
	const workDuration = workDurationMinutes * 60;
	const breakDuration = breakDurationMinutes * 60;
	const totalDuration = workDuration + breakDuration;

	// Calculer les proportions du cercle
	const workProportion = workDuration / totalDuration;
	const breakProportion = breakDuration / totalDuration;

	// Calculer la position actuelle dans le cycle complet
	let currentPosition = 0;
	if (currentPhase === "work") {
		// Dans la phase de travail
		const workElapsed = workDuration - timeLeft;
		currentPosition = workElapsed / totalDuration;
	} else if (currentPhase === "break") {
		// Dans la phase de pause (après le travail)
		const breakElapsed = breakDuration - timeLeft;
		currentPosition = workProportion + breakElapsed / totalDuration;
	}

	// SVG setting
	const workArcLength = circumference * workProportion;
	const breakArcLength = circumference * breakProportion;
	const currentPositionOffset = circumference * (1 - currentPosition);

	const backgroundColor = COLORS.text === "#000" ? "#D1D5DB" : "#374151";

	const center = size / 2;

	return (
		<Animated.View
			style={[
				styles.container,
				{
					width: size,
					height: size,
					transform: [{ scale: scaleAnim }],
				},
			]}
		>
			<Svg width={size} height={size} style={styles.svg}>
				<G rotation="270" origin={`${center}, ${center}`}>
					<Circle
						cx={center}
						cy={center}
						r={radius}
						stroke={backgroundColor}
						strokeWidth={strokeWidth}
						fill="transparent"
						opacity={0.8}
					/>

					<Circle
						cx={center}
						cy={center}
						r={radius}
						stroke={COLORS.workColor}
						strokeWidth={strokeWidth - 1}
						strokeDasharray={`${workArcLength} ${circumference - workArcLength}`}
						strokeDashoffset={0}
						fill="transparent"
						opacity={currentPhase === "work" ? 0.9 : 0.5}
					/>

					<Circle
						cx={center}
						cy={center}
						r={radius}
						stroke={COLORS.breakColor}
						strokeWidth={strokeWidth - 1}
						strokeDasharray={`${breakArcLength} ${circumference - breakArcLength}`}
						strokeDashoffset={-workArcLength}
						fill="transparent"
						opacity={currentPhase === "break" ? 0.9 : 0.5}
					/>

					<Circle
						cx={center}
						cy={center}
						r={radius}
						stroke="#FFFFFF"
						strokeWidth={strokeWidth}
						strokeDasharray={`1 ${circumference - 1}`}
						strokeDashoffset={currentPositionOffset}
						strokeLinecap="round"
						fill="transparent"
						opacity={0.95}
					/>
				</G>
			</Svg>

			{/* Contenu central avec animation */}
			<Animated.View style={[styles.centerContent, { transform: [{ scale: phaseAnim }] }]}>
				<Text style={[styles.phaseText, { color: COLORS.text }]}>
					{currentPhase === "work"
						? t("TIMER.PHASE.WORK")
						: currentPhase === "break"
							? t("TIMER.PHASE.BREAK")
							: t("TIMER.PHASE.FINISHED")}
				</Text>
				<Text style={[styles.timerDisplay, { color: COLORS.text }]}>{formattedTime}</Text>
			</Animated.View>

			{/* Effet de pulsation pour l'indicateur de phase active */}
			<Animated.View
				style={[
					styles.pulseIndicator,
					{
						width: size * 0.15,
						height: size * 0.15,
						borderRadius: size * 0.075,
						backgroundColor: currentPhase === "work" ? COLORS.workColor : COLORS.breakColor,
						transform: [{ scale: pulseAnim }],
						opacity: 0.3,
					},
				]}
			/>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
		padding: 4,
	} as ViewStyle,
	svg: {
		position: "absolute",
	} as ViewStyle,
	centerContent: {
		alignItems: "center",
		justifyContent: "center",
	} as ViewStyle,
	phaseText: {
		fontSize: TYPOGRAPHY.sizes.md,
		fontWeight: TYPOGRAPHY.weights.semibold,
		marginBottom: 12,
		textAlign: "center",
		letterSpacing: 0.5,
		textTransform: "uppercase",
	} as TextStyle,
	timerDisplay: {
		fontSize: TYPOGRAPHY.sizes["3xl"],
		fontWeight: TYPOGRAPHY.weights.bold,
		textAlign: "center",
		letterSpacing: 1,
	} as TextStyle,
	pulseIndicator: {
		position: "absolute",
		zIndex: -1,
	} as ViewStyle,
});
