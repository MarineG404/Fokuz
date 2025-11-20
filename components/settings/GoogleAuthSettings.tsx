import { useThemeColors } from "@/constants/color";
import SPACING from "@/constants/spacing";
import TYPOGRAPHY from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import React from "react";

import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

const STORAGE_KEY = "@fokuz:google_token";

export default function GoogleAuthSettings() {
	const { t } = useTranslation();
	const COLORS = useThemeColors();
	const [token, setToken] = React.useState<string | null>(null);
	const [loading, setLoading] = React.useState(true);

	// Pour Expo WebBrowser
	WebBrowser.maybeCompleteAuthSession();

	// Load stored token (if any)
	React.useEffect(() => {
		(async () => {
			const stored = await AsyncStorage.getItem(STORAGE_KEY);
			setToken(stored);
			setLoading(false);
		})();
	}, []);

	const discovery = {
		authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
		tokenEndpoint: 'https://oauth2.googleapis.com/token',
	};

	const [request, response, promptAsync] = AuthSession.useAuthRequest(
		{
			clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB ?? "",
			scopes: ["profile", "email", "https://www.googleapis.com/auth/tasks.readonly"],
			// Use the Expo auth proxy redirect (hard-coded)
			redirectUri: "https://auth.expo.io/@marineg404/Fokuz",
			responseType: AuthSession.ResponseType.Code,
			usePKCE: true,
		},
		discovery
	);

	React.useEffect(() => {
		console.log("Auth response:", JSON.stringify(response, null, 2));
		if (response?.type === "success") {
			const code = response.params?.code;
			console.log("Authorization code received:", code ? "YES" : "NO");

			if (code) {
				(async () => {
					try {
						const tokenResponse = await AuthSession.exchangeCodeAsync(
							{
								clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB ?? "",
								code: code,
								redirectUri: "https://auth.expo.io/@marineg404/Fokuz",
								extraParams: {
									code_verifier: request?.codeVerifier || "",
								},
							},
							discovery
						);
						console.log("Token exchange success:", tokenResponse.accessToken ? "YES" : "NO");
						if (tokenResponse.accessToken) {
							await AsyncStorage.setItem(STORAGE_KEY, tokenResponse.accessToken);
							setToken(tokenResponse.accessToken);
							Alert.alert("Succès", "Connexion Google réussie !");
						}
					} catch (err) {
						console.error("Token exchange error:", err);
						Alert.alert("Erreur", "Échec de l'échange du code : " + String(err));
					}
				})();
			}
		} else if (response?.type === "error") {
			console.error("Auth error:", response.error);
			Alert.alert("Erreur", response.error?.message || "Échec de l'authentification");
		}
	}, [response]);

	const signIn = async () => {
		console.log("Signing in with Google...");
		console.log('REDIRECT_URI (proxy):', "https://auth.expo.io/@marineg404/Fokuz");
		console.log('CLIENT_ID (Web):', process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB ?? 'MISSING');

		if (!request) {
			Alert.alert(t("GOOGLE_AUTH.ERROR"), "Auth request not ready. Please try again.");
			return;
		}

		try {
			const result = await promptAsync();
			console.log("promptAsync result:", result);
		} catch (err) {
			console.error("promptAsync error:", err);
			Alert.alert(t("GOOGLE_AUTH.ERROR"), String(err));
		}
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
