import { methods } from "@/assets/data/methods";
import { HeaderTitle } from "@/components/HeaderTitle";
import { TimerComponent } from "@/components/TimerComponent";
import { useThemeColors } from "@/constants/color";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function MethodDetails() {
	const params = useLocalSearchParams();
	const id = params.id as string | undefined;
	const COLORS = useThemeColors();

	const method = methods.find((m) => m.id === id);

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
			<HeaderTitle title={method ? method.name : "Méthode non trouvée"} showBack />

			<View style={styles.content}>
				{method ? (
					<>
						<Text style={[styles.description, { color: COLORS.text }]}>
							{method.description}
						</Text>

						<Text style={[styles.sectionTitle, { color: COLORS.primary }]}>Durée</Text>
						<Text style={[styles.meta, { color: COLORS.textSecondary }]}>
							Travail: {method.workDuration} minutes
						</Text>
						{method.breakDuration && (
							<Text style={[styles.meta, { color: COLORS.textSecondary }]}>
								Pause: {method.breakDuration} minutes
							</Text>
						)}

						{/* Timer Section */}
						<TimerComponent
							workDurationMinutes={method.workDuration}
							breakDurationMinutes={method.breakDuration}
						/>
					</>
				) : (
					<Text style={[styles.meta, { color: COLORS.textSecondary }]}>
						Méthode non trouvée (id: {id})
					</Text>
				)}
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
	content: {
		flex: 1,
		paddingTop: 8,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginTop: 8,
		marginBottom: 8,
	},
	description: {
		fontSize: 16,
		lineHeight: 24,
		marginBottom: 12,
		textAlign: "center",
	},
	meta: {
		marginTop: 4,
		fontSize: 16,
		marginLeft: 8,
	},
});
