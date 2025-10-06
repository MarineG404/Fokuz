import { methods } from "@/assets/data/methods";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useThemeColors } from "@/constants/color";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = useThemeColors();


export default function MethodDetails() {
	const params = useLocalSearchParams();
	const id = params.id as string | undefined;

	const method = methods.find((m) => m.id === id);

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
			<HeaderTitle title={method ? method.name : "Méthode non trouvée"} showBack />

			<View style={styles.container}>
				<Text style={styles.title}>Détails de la méthode</Text>
				<Text style={styles.subtitle}>Voici les détails pour la méthode sélectionnée :</Text>
				<Text style={styles.methodName}>{method ? method.name : "Méthode non trouvée"}</Text>
				<Text style={styles.meta}>id: {id}</Text>
			</View>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: "700",
		marginBottom: 8,
		color: COLORS.primary,
	},
	subtitle: {
		color: COLORS.text,
	},
	methodName: {
		color: COLORS.text,
		fontSize: 18,
		marginTop: 8,
	},
	meta: {
		color: COLORS.textSecondary,
		marginTop: 6,
	},
});
