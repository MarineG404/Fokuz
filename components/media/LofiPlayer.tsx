import { LOFI_VIDEOS } from "@/assets/data/lofiVideos";
import { useThemeColors } from "@/constants/color";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import BlockCard from "../ui/BlockCard";

interface LofiPlayerProps {
	isVisible?: boolean;
}

export const LofiPlayer: React.FC<LofiPlayerProps> = ({ isVisible = true }) => {
	const COLORS = useThemeColors();
	const { t } = useTranslation();
	const [playing, setPlaying] = useState(false);
	const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [playerKey, setPlayerKey] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [hasError, setHasError] = useState(false);

	if (!isVisible) return null;

	const changeVideo = (newIndex: number) => {
		setIsLoading(true);
		setHasError(false);
		setCurrentVideoIndex(newIndex);
		setPlayerKey((prev) => prev + 1);
		setPlaying(false);
	};

	const previousVideo = () => {
		const newIndex = (currentVideoIndex - 1 + LOFI_VIDEOS.length) % LOFI_VIDEOS.length;
		changeVideo(newIndex);
	};

	const nextVideo = () => {
		const newIndex = (currentVideoIndex + 1) % LOFI_VIDEOS.length;
		changeVideo(newIndex);
	};

	const toggleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};

	const currentVideo = LOFI_VIDEOS[currentVideoIndex];

	return (
		<BlockCard style={[styles.container, isCollapsed && styles.collapsed]}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<Ionicons name="musical-notes" size={20} color={COLORS.primary} />
					<View style={styles.titleContainer}>
						<Text style={[styles.title, { color: COLORS.text }]}>{t("LOFI_PLAYER.TITLE")}</Text>
						{!isCollapsed && (
							<Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>
								{currentVideo.title}
							</Text>
						)}
					</View>
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
						{isLoading && (
							<View style={styles.loadingOverlay}>
								<ActivityIndicator size="large" color={COLORS.primary} />
								<Text style={[styles.loadingText, { color: COLORS.textSecondary }]}>
									Chargement...
								</Text>
							</View>
						)}

						{hasError && (
							<View style={[styles.errorContainer, { backgroundColor: COLORS.background }]}>
								<Ionicons name="alert-circle" size={48} color="#EF4444" />
								<Text style={[styles.errorText, { color: COLORS.text }]}>Vidéo indisponible</Text>
								<TouchableOpacity
									style={[styles.retryButton, { backgroundColor: COLORS.primary }]}
									onPress={nextVideo}
								>
									<Text style={styles.retryButtonText}>Vidéo suivante</Text>
								</TouchableOpacity>
							</View>
						)}

						<YoutubePlayer
							key={playerKey}
							height={180}
							play={playing}
							videoId={currentVideo.id}
							onChangeState={(state: string) => {
								if (state === "ended") {
									nextVideo();
								}
								if (state === "playing") {
									setIsLoading(false);
									setHasError(false);
								}
							}}
							onReady={() => {
								setIsLoading(false);
								setPlaying(true);
							}}
							onError={() => {
								setIsLoading(false);
								setHasError(true);
							}}
							forceAndroidAutoplay={true}
							initialPlayerParams={{
								preventFullScreen: false,
								modestbranding: true,
								rel: false,
							}}
						/>
					</View>

					{/* Controls */}
					<View style={styles.controls}>
						<TouchableOpacity
							style={[
								styles.controlButton,
								styles.secondaryButton,
								{ borderColor: COLORS.primary },
							]}
							onPress={previousVideo}
							disabled={isLoading}
						>
							<Ionicons
								name="play-skip-back"
								size={20}
								color={isLoading ? COLORS.textSecondary : COLORS.primary}
							/>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.controlButton, { backgroundColor: COLORS.primary }]}
							onPress={() => setPlaying(!playing)}
							disabled={isLoading || hasError}
						>
							<Ionicons name={playing ? "pause" : "play"} size={24} color="#FFFFFF" />
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								styles.controlButton,
								styles.secondaryButton,
								{ borderColor: COLORS.primary },
							]}
							onPress={nextVideo}
							disabled={isLoading}
						>
							<Ionicons
								name="play-skip-forward"
								size={20}
								color={isLoading ? COLORS.textSecondary : COLORS.primary}
							/>
						</TouchableOpacity>
					</View>

					{/* Progress indicator */}
					<View style={styles.progressContainer}>
						{LOFI_VIDEOS.map((_, index) => (
							<View
								key={index}
								style={[
									styles.progressDot,
									{
										backgroundColor:
											index === currentVideoIndex ? COLORS.primary : COLORS.textSecondary + "40",
									},
								]}
							/>
						))}
					</View>
				</>
			)}
		</BlockCard>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 16,
	},
	collapsed: {
		paddingBottom: 16,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	titleContainer: {
		marginLeft: 8,
		flex: 1,
	},
	title: {
		fontSize: 16,
		fontWeight: "600",
	},
	subtitle: {
		fontSize: 12,
		marginTop: 2,
	},
	playerContainer: {
		borderRadius: 12,
		overflow: "hidden",
		marginBottom: 16,
		position: "relative",
		minHeight: 180,
	},
	loadingOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.7)",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 10,
	},
	loadingText: {
		marginTop: 8,
		fontSize: 14,
	},
	errorContainer: {
		height: 180,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 12,
		padding: 20,
	},
	errorText: {
		fontSize: 16,
		fontWeight: "600",
		marginTop: 12,
		marginBottom: 16,
	},
	retryButton: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 8,
	},
	retryButtonText: {
		color: "#FFFFFF",
		fontWeight: "600",
	},
	controls: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 12,
		marginBottom: 12,
	},
	controlButton: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: "center",
		alignItems: "center",
	},
	secondaryButton: {
		backgroundColor: "transparent",
		borderWidth: 2,
	},
	progressContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 6,
	},
	progressDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
	},
});
