import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

interface CircularTimerProps {
	progress: number; // 0 to 1
	color: string;
	size?: number;
	strokeWidth?: number;
	backgroundColor?: string;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
	progress,
	color,
	size = 200,
	strokeWidth = 12,
	backgroundColor = '#e0e0e0',
}) => {
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const strokeDasharray = circumference;
	const strokeDashoffset = circumference * (1 - progress);

	return (
		<View style={[styles.container, { width: size, height: size }]}>
			<Svg width={size} height={size} style={styles.svg}>
				<G rotation="270" origin={`${size / 2}, ${size / 2}`}>
					{/* Background circle */}
					<Circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke={backgroundColor}
						strokeWidth={strokeWidth}
						fill="transparent"
					/>
					{/* Progress circle */}
					<Circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke={color}
						strokeWidth={strokeWidth}
						strokeDasharray={strokeDasharray}
						strokeDashoffset={strokeDashoffset}
						strokeLinecap="round"
						fill="transparent"
					/>
				</G>
			</Svg>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	svg: {
		position: 'absolute',
	},
});
