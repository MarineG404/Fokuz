import TYPOGRAPHY from '@/constants/typography';
import { useThemeColors } from "@/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
	title: string;
	showDrawer?: boolean;
	showBack?: boolean;
};

export const HeaderTitle = ({ title, showDrawer = false, showBack = false }: Props) => {
	const navigation = useNavigation();
	const COLORS = useThemeColors();
	const { t } = useTranslation();

	const hasButtons = showDrawer || showBack;

	return (
		<View style={[styles.headerRow, !hasButtons && styles.headerRowSimple]}>
			{showDrawer && (
				<TouchableOpacity
					onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
					style={styles.menuButton}
					accessibilityRole="button"
					accessibilityLabel={t("HEADER.OPEN_MENU")}
				>
					<Ionicons name="menu" size={26} color={COLORS.primary} accessible={false} />
				</TouchableOpacity>
			)}

			{showBack && (
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={styles.menuButton}
					accessibilityRole="button"
					accessibilityLabel={t("HEADER.GO_BACK")}
				>
					<Ionicons name="arrow-back" size={26} color={COLORS.primary} accessible={false} />
				</TouchableOpacity>
			)}

			<Text
				pointerEvents="none"
				style={[
					styles.headerTitle,
					hasButtons ? styles.headerTitleCentered : styles.headerTitleSimple,
					{ color: COLORS.primary, fontSize: TYPOGRAPHY.sizes['xl'] },
				]}
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
		width: 44,
		height: 44,
		padding: 6,
		borderRadius: 8,
		zIndex: 2,
		alignItems: "center",
		justifyContent: "center",
	},
	headerTitle: {
		fontWeight: TYPOGRAPHY.weights.bold,
		marginBottom: 0,
		lineHeight: 26,
	},
	headerTitleCentered: {
		position: "absolute",
		left: 0,
		right: 0,
		textAlign: "center",
	},
	headerTitleSimple: {
		textAlign: "center",
		flex: 1,
	},
	headerRowSimple: {
		minHeight: 44,
		justifyContent: "center",
	},
});
