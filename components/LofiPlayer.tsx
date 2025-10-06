import { useThemeColors } from '@/constants/color';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

interface LofiPlayerProps {
	isVisible?: boolean;
}

// Playlist de videos lofi populaires
const LOFI_VIDEOS = [
	'jfKfPfyJRdk', // lofi hip hop radio - beats to relax/study to
	'5qap5aO4i9A', // lofi hip hop radio - beats to sleep/chill to
	'DWcJFNfaw9c', // synthwave radio - beats to chill/game to
];

export const LofiPlayer: React.FC<LofiPlayerProps> = ({ isVisible = true }) => {
	const COLORS = useThemeColors();
	const [playing, setPlaying] = useState(false);
	const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
	const [isCollapsed, setIsCollapsed] = useState(false);

	if (!isVisible) return null;

	const previousVideo = () => {
		setCurrentVideoIndex((prev) => (prev - 1 + LOFI_VIDEOS.length) % LOFI_VIDEOS.length);
	};

	const nextVideo = () => {
		setCurrentVideoIndex((prev) => (prev + 1) % LOFI_VIDEOS.length);
	};

	const toggleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};

	return (
		<View style={[
			styles.container,
			COLORS.text === '#000' ? styles.containerLight : styles.containerDark,
			{ backgroundColor: COLORS.cardBackground },
			isCollapsed && styles.collapsed
		]}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<Ionicons name="musical-notes" size={20} color={COLORS.primary} />
					<Text style={[styles.title, { color: COLORS.text }]}>
						Lofi Focus
					</Text>
				</View>
				<TouchableOpacity onPress={toggleCollapse}>
					<Ionicons
						name={isCollapsed ? "chevron-up" : "chevron-down"}
						size={20}
						color={COLORS.textSecondary}
					/>
				</TouchableOpacity>
			</View>

			{/* Player */}
			{!isCollapsed && (
				<>
					<View style={styles.playerContainer}>
						<YoutubePlayer
							height={180}
							play={playing}
							videoId={LOFI_VIDEOS[currentVideoIndex]}
							onChangeState={(state: string) => {
								if (state === 'ended') {
									nextVideo();
								}
							}}
						/>
					</View>

					{/* Controls */}
					<View style={styles.controls}>
						<TouchableOpacity
							style={[styles.controlButton, styles.secondaryButton, { borderColor: COLORS.primary }]}
							onPress={previousVideo}
						>
							<Ionicons name="play-skip-back" size={20} color={COLORS.primary} />
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.controlButton, styles.secondaryButton, { borderColor: COLORS.primary }]}
							onPress={nextVideo}
						>
							<Ionicons name="play-skip-forward" size={20} color={COLORS.primary} />
						</TouchableOpacity>
					</View>
				</>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 16,
		padding: 16,
		marginBottom: 16,
	},
	containerLight: {
		borderWidth: 1,
		borderColor: '#E5E7EB',
	},
	containerDark: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 8,
		elevation: 6,
	},
	collapsed: {
		paddingBottom: 16,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	headerLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8,
	},
	playerContainer: {
		borderRadius: 12,
		overflow: 'hidden',
		marginBottom: 16,
	},
	controls: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 12,
	},
	controlButton: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: 'center',
		alignItems: 'center',
	},
	secondaryButton: {
		backgroundColor: 'transparent',
		borderWidth: 2,
	},
});
