import { useThemeColors } from "@/constants/color";
import SPACING from "@/constants/spacing";
import TYPOGRAPHY from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import React from "react";

import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

const STORAGE_KEY = "@fokuz:google_token";

const GoogleAuthSettings: React.FC = () => {
	const { t } = useTranslation();
	const COLORS = useThemeColors();
	const [token, setToken] = React.useState<string | null>(null);
	const [loading, setLoading] = React.useState(true);

	// Pour Expo WebBrowser
	WebBrowser.maybeCompleteAuthSession();

	React.useEffect(() => {
		(async () => {
			const stored = await AsyncStorage.getItem(STORAGE_KEY);
			setToken(stored);
			setLoading(false);
		})();
	}, []);

	const signIn = async () => {
		console.log("Signing in with Google...");
		console.log(process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID);
	};
	const signOut = async () => {
		console.log("Signing out from Google...");
	};

	return (
		<View
			style={[
				styles.card,
				{
					backgroundColor: COLORS.card,
					borderColor: COLORS.border,
				},
			]}
		>
			<Text style={[styles.title, { color: COLORS.text }]}>{t("GOOGLE_AUTH.TITLE")}</Text>
			{loading ? (
				<Text style={{ color: COLORS.textSecondary }}>{t("LOADING")}</Text>
			) : token ? (
				<>
					<Text style={{ color: COLORS.text }}>{t("GOOGLE_AUTH.CONNECTED")}</Text>
					<Pressable style={[styles.button, { backgroundColor: "#e53935" }]} onPress={signOut}>
						<Ionicons name="log-out-outline" size={18} color={COLORS.text} style={{ marginRight: 8 }} />
						<Text style={[styles.buttonText, { color: COLORS.text }]}>{t("GOOGLE_AUTH.SIGN_OUT")}</Text>
					</Pressable>
				</>
			) : (
				<Pressable style={[styles.button, { backgroundColor: COLORS.primary }]} onPress={signIn}>
					<Ionicons name="logo-google" size={18} color={COLORS.text} style={{ marginRight: 8 }} />
					<Text style={[styles.buttonText, { color: COLORS.text }]}>{t("GOOGLE_AUTH.SIGN_IN")}</Text>
				</Pressable>
			)}
		</View>
	);
};

export default GoogleAuthSettings;

const styles = StyleSheet.create({
	card: {
		borderRadius: SPACING.radius.lg,
		padding: SPACING.large,
		marginVertical: 12,
		alignItems: "center",
		borderWidth: 1,
		width: "100%",
	},
	title: {
		fontSize: TYPOGRAPHY.sizes.base,
		fontWeight: TYPOGRAPHY.weights.semibold,
		marginBottom: 6,
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: SPACING.radius.md,
		paddingVertical: SPACING.padding.md,
		paddingHorizontal: SPACING.xl,
		marginTop: SPACING.md,
	},
	buttonText: {
		fontWeight: TYPOGRAPHY.weights.bold,
		fontSize: TYPOGRAPHY.alias.button,
	},
});
