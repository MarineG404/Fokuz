import { useThemeColors } from "@/constants/color";
import { SPACING } from "@/constants/spacing";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
	title: string;
	subtitle?: string;
	iconName?: React.ComponentProps<typeof Ionicons>["name"];
	active: boolean;
	onToggle: () => void;
};

export default function ToggleRow({ title, subtitle, iconName, active, onToggle }: Props) {
	const COLORS = useThemeColors();

	return (
		<View style={styles.container}>
			<Pressable
				style={[
					styles.toggleContainer,
					{
						backgroundColor: COLORS.card,
						borderColor: COLORS.border,
					},
				]}
				onPress={onToggle}
				accessibilityRole="switch"
				accessibilityLabel={title}
				accessibilityState={{ checked: active }}
			>
				<View style={styles.iconTextContainer}>
					{iconName ? (
						<Ionicons
							name={iconName}
							size={24}
							color={active ? COLORS.primary : COLORS.textSecondary}
						/>
					) : null}
					<View style={styles.textContainer}>
						<Text style={[styles.title, { color: COLORS.text }]}>{title}</Text>
						{subtitle ? (
							<Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>{subtitle}</Text>
						) : null}
					</View>
				</View>

				<View
					style={[
						styles.switch,
						{
							backgroundColor: active ? COLORS.primary : COLORS.textSecondary,
						},
					]}
				>
					<View
						style={[
							styles.switchThumb,
							{
								backgroundColor: COLORS.background,
								transform: [{ translateX: active ? 22 : 2 }],
							},
						]}
					/>
				</View>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {},
	toggleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: SPACING.large,
		borderRadius: SPACING.radius,
		borderWidth: 1,
	},
	iconTextContainer: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	textContainer: {
		marginLeft: SPACING.medium,
		flex: 1,
	},
	title: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 2,
	},
	subtitle: {
		fontSize: 14,
	},
	switch: {
		width: 50,
		height: 30,
		borderRadius: 15,
		justifyContent: "center",
		position: "relative",
	},
	switchThumb: {
		width: 26,
		height: 26,
		borderRadius: 13,
		position: "absolute",
	},
});
