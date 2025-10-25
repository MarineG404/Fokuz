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

const LOFI_VIDEOS = [
	{ id: "qEN5ZHDi1Kg", title: "back to school 📚", category: ["lofi hip hop"] },
	{ id: "8b3fqIBrNW0", title: "lofi hip hop mix 📚 beats to relax/study to (Part 2)", category: ["relax", "study"] },
	{ id: "M8J9zHyyUYc", title: "lofi beats to do absolutely nothing to", category: ["Other"] },
	{ id: "deRDilpdOnE", title: "Summer in Rio 🏖️", category: ["bossa", "summer lofi"] },
	{ id: "rwLv6YPiGsE", title: "Lofi Girl x Assassin\'s Creed Shadows - Stealthy beats to relax to 🌸", category: ["relax"] },
	{ id: "aWV6uv8Que0", title: "it\'s 2017 and you\'re listening to lofi hip hop for the first time", category: ["lofi hip hop"] },
	{ id: "ohyiTPgAxgY", title: "Parisian Romance ❤️", category: ["french lofi"] },
	{ id: "xsDnEj2Hx4Q", title: "Blue Monday ☔", category: ["sad lofi"] },
	{ id: "lA9FONoiuFA", title: "Best of lofi 2024 🎆 beats to chill/study to", category: ["chill", "study"] },
	{ id: "wgwcBTrY9og", title: "Lofi Girl - Christmas 2024 🎄", category: ["christmas"] },
	{ id: "VXY2P8vKgV4", title: "Lofi Girl x Chess.com - Synthwave beats to play chess to ♟️", category: ["synthwave"] },
	{ id: "VDtjKuS2R3E", title: "1 P.M Study Session 🎹", category: ["calm piano", "study"] },
	{ id: "D6TSIHxNzfU", title: "Lofi Girl - Halloween 2024 🎃", category: ["halloween"] },
	{ id: "CFGLoQIhmow", title: "lofi hip hop mix 📚 beats to relax/study to (Part 1)", category: ["relax", "study"] },
	{ id: "MadEqVeRFuM", title: "Music to put you in a better mood 🍹", category: ["brazilian lofi"] },
	{ id: "WBnjO3zEwCM", title: "Journey Through Time 🏰", category: ["medieval lofi"] },
	{ id: "8Wpy_DOeaP8", title: "Childhood Memories 🎸", category: ["chill guitar"] },
	{ id: "9zb_6EgG0F8", title: "Saturday Chillin\' ☀️", category: ["summer lofi"] },
	{ id: "w4TNGhSj2tc", title: "3 A.M Chill Session 🌌", category: ["synthwave", "chill"] },
	{ id: "cYPJaHT5f3E", title: "Peaceful Day 🎹", category: ["calm piano"] },
	{ id: "CMNyHBx1gak", title: "Lonely Night 🌑", category: ["dark ambient"] },
	{ id: "mmKguZohAck", title: "Best of lofi hip hop 2023 🎉 - beats to relax/study to", category: ["relax", "study"] },
	{ id: "1YBtzAAChU8", title: "Lofi Girl - Christmas 2023 🎄", category: ["christmas"] },
	{ id: "EeRfSNx5RhE", title: "Lofi Girl x Chess.com ♟", category: ["lofi hip hop"] },
	{ id: "0MiR7bC9B5o", title: "Lofi Girl - Halloween 2023 🎃", category: ["halloween"] },
	{ id: "g6LhK0wTemE", title: "Lofi Girl – chill beats for LEGO building 🧱", category: ["chill"] },
	{ id: "Z-_TTyZUOLk", title: "2 A.M Chill Session 🌌", category: ["synthwave", "chill"] },
	{ id: "1bvbsx-hpFc", title: "Restful Holidays ☀️", category: ["summer lofi"] },
	{ id: "TlWYgGyNnJo", title: "1 A.M Chill Session 🌌", category: ["synthwave", "chill"] },
	{ id: "i43tkaTXtwI", title: "Best of lofi hip hop 2022 🎆 - beats to relax/study to", category: ["relax", "study"] },
	{ id: "O7RG-B6N1Vw", title: "Lonely Days ☔", category: ["sad lofi"] },
	{ id: "-R0UYHS8A_A", title: "Afternoon Jazz 🎷", category: ["jazz lofi"] },
	{ id: "1fueZCTYkpA", title: "Morning Coffee ☕️", category: ["lofi hip hop"] },
	{ id: "l98w9OSKVNA", title: "12 A.M Study Session 📚", category: ["lofi hip hop"] },
	{ id: "n61ULEU7CO0", title: "Best of lofi hip hop 2021 ✨", category: ["relax", "study"] },
	{ id: "gnZImHvA0ME", title: "Soothing Breeze 🍃", category: ["asian lofi"] },
	{ id: "TURbeWK2wwg", title: "4 A.M Study Session 📚", category: ["lofi hip hop"] },
	{ id: "_tV5LEBDs7w", title: "Cozy Winter ❄️", category: ["lofi hip hop"] },
	{ id: "BTYAsjAVa3I", title: "3 A.M Study Session 📚", category: ["lofi hip hop"] },
	{ id: "zFhfksjf_mY", title: "Lazy Sunday 💤", category: ["lofi hip hop"] },
	{ id: "wAPCSnAhhC8", title: "2 A.M Study Session 📚", category: ["lofi hip hop"] },
	{ id: "lTRiuFIWV54", title: "1 A.M Study Session 📚", category: ["lofi hip hop"] },
	{ id: "-FlxM_0S2lA", title: "Best of lofi 2018 🎶 beats to chill/study to", category: ["chill", "study"] },
];

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
