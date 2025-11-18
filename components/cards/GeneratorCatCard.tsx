import { useThemeColors } from "@/constants/color";
import SPACING from "@/constants/spacing";
import TYPOGRAPHY from "@/constants/typography";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";

export const GeneratorCatCard = () => {
	const COLORS = useThemeColors();
	const { t } = useTranslation();
	const [catUrl, setCatUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const fetchCat = async () => {
		setLoading(true);
		// Add a parameter to avoid cache
		const url = `https://cataas.com/cat?${Date.now()}`;
		setCatUrl(url);
		setLoading(false);
	};

	React.useEffect(() => {
		fetchCat();
	}, []);

	return (
		<View style={{ alignItems: "center", width: "100%" }}>
			<Text style={[styles.title, { color: COLORS.primary }]}>{t("CAT_CARD.TITLE")}</Text>
			<View
				style={{ minHeight: 180, minWidth: 180, justifyContent: "center", alignItems: "center" }}
			>
				{loading && <ActivityIndicator color={COLORS.primary} size="large" />}
				{catUrl && !loading && (
					<Image
						source={{ uri: catUrl }}
						style={styles.catImage}
						resizeMode="cover"
						accessibilityLabel={t("CAT_CARD.IMAGE_ALT")}
					/>
				)}
			</View>
			<Pressable
				onPress={fetchCat}
				style={({ pressed }) => [
					styles.button,
					{ backgroundColor: COLORS.primary, opacity: pressed ? 0.8 : 1 },
				]}
				accessibilityRole="button"
				accessibilityLabel={t("CAT_CARD.BUTTON_A11Y")}
			>
				<Text style={[styles.buttonText, { color: COLORS.text }]}>{t("CAT_CARD.BUTTON")}</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	title: {
		fontSize: TYPOGRAPHY.sizes.lg,
		fontWeight: TYPOGRAPHY.weights.bold,
		marginBottom: SPACING.md,
		textAlign: "center",
	},
	catImage: {
		width: 180,
		height: 180,
		borderRadius: SPACING.radius.md,
		marginBottom: SPACING.md,
		backgroundColor: "#eee",
	},
	button: {
		marginTop: SPACING.sm,
		borderRadius: SPACING.radius.sm,
		paddingVertical: SPACING.padding.sm,
		paddingHorizontal: SPACING["2xl"],
		alignItems: "center",
		alignSelf: "center",
	},
	buttonText: {
		fontWeight: TYPOGRAPHY.weights.bold,
		fontSize: TYPOGRAPHY.alias.button,
	},
});
