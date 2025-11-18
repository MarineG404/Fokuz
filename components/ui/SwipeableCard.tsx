import { useThemeColors } from "@/constants/color";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";

interface SwipeableCardProps {
	children: React.ReactNode;
	onDelete: () => void;
	deleteLabel?: string;
}

const DELETE_THRESHOLD = 150; // Distance pour auto-delete

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
	children,
	onDelete,
	deleteLabel = "Supprimer",
}) => {
	const COLORS = useThemeColors();
	const swipeableRef = useRef<Swipeable>(null);

	const handleSwipeableWillOpen = (direction: "left" | "right") => {
		if (direction === "right") {
			// Auto-suppression si on swipe assez loin
			setTimeout(() => onDelete(), 200);
		}
	};

	const renderRightActions = (
		progress: Animated.AnimatedInterpolation<number>,
		dragX: Animated.AnimatedInterpolation<number>,
	) => {
		// Scale de l'icône
		const scale = dragX.interpolate({
			inputRange: [-150, -100, -50, 0],
			outputRange: [1.2, 1, 0.8, 0.5],
			extrapolate: "clamp",
		});

		// Opacité de l'icône
		const opacity = dragX.interpolate({
			inputRange: [-100, -50, 0],
			outputRange: [1, 0.6, 0],
			extrapolate: "clamp",
		});

		return (
			<View style={styles.rightActionsContainer}>
				<RectButton
					style={styles.deleteButton}
					onPress={() => {
						swipeableRef.current?.close();
						setTimeout(() => onDelete(), 250);
					}}
				>
					<Animated.View
						style={{
							opacity,
							transform: [{ scale }],
						}}
					>
						<Ionicons name="trash" size={28} color="#FFFFFF" />
					</Animated.View>
				</RectButton>
			</View>
		);
	};

	return (
		<Swipeable
			ref={swipeableRef}
			renderRightActions={renderRightActions}
			friction={1.8}
			rightThreshold={DELETE_THRESHOLD}
			overshootRight={false}
			overshootFriction={3}
			onSwipeableWillOpen={handleSwipeableWillOpen}
		>
			{children}
		</Swipeable>
	);
};

const styles = StyleSheet.create({
	rightActionsContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "stretch",
		marginBottom: 12,
	} as ViewStyle,
	deleteButton: {
		backgroundColor: "#EF4444",
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
		minWidth: 100,
		borderTopRightRadius: 12,
		borderBottomRightRadius: 12,
	} as ViewStyle,
});

export default SwipeableCard;
