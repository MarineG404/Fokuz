import { useThemeColors } from "@/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
	title: string;
	showDrawer?: boolean;
	showBack?: boolean;
};

export const HeaderTitle = ({ title, showDrawer = false, showBack = false }: Props) => {
	const navigation = useNavigation();
	const COLORS = useThemeColors();

	return (
		<View style={styles.headerRow}>
			{showDrawer && (
				<TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={styles.menuButton}>
					<Ionicons name="menu" size={26} color={COLORS.primary} />
				</TouchableOpacity>
			)}

			{showBack && (
				<TouchableOpacity onPress={() => navigation.goBack()} style={styles.menuButton}>
					<Ionicons name="arrow-back" size={26} color={COLORS.primary} />
				</TouchableOpacity>
			)}

			<Text
				pointerEvents="none"
				style={[styles.headerTitle, styles.headerTitleCentered, { color: COLORS.primary, fontSize: 26 }]}
			>
				{title}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
		position: "relative",
	},
	menuButton: {
		marginRight: 12,
		padding: 6,
		borderRadius: 8,
		zIndex: 2,
	},
	headerTitle: {
		fontWeight: "700",
		marginBottom: 0,
		lineHeight: 26,
	},
	headerTitleCentered: {
		position: "absolute",
		left: 0,
		right: 0,
		textAlign: "center",
	},
});
