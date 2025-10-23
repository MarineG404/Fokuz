import type { Method } from "@/assets/data/methods";
import { MethodCard } from "@/components/cards/MethodCard";
import { AddMethodModal } from "@/components/modals/AddMethodModal";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { HeaderTitle } from "@/components/ui/HeaderTitle";
import { useThemeColors } from "@/constants/color";
import { useTimerContext } from "@/contexts/TimerContext";
import { useAllMethods } from "@/hooks/useAllMethods";
import { useCustomMethods } from "@/hooks/useCustomMethods";
import { historyService } from "@/utils/historyService";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function HomeScreen() {
	const router = useRouter();
	const COLORS = useThemeColors();
	const { allMethods } = useAllMethods();
	const { addCustomMethod } = useCustomMethods();
	const [modalVisible, setModalVisible] = useState(false);
	const { timerState, clearTimerState } = useTimerContext();
	const { t } = useTranslation();
	const [refreshKey, setRefreshKey] = useState(0);

	const hasActiveSession = !!(
		timerState.current &&
		timerState.current.isRunning &&
		timerState.current.phase !== "finished" &&
		timerState.current.timeLeft > 0
	);

	const handleAddMethod = async (method: Omit<Method, "id">) => {
		await addCustomMethod(method);
	};

	useFocusEffect(
		useCallback(() => {
			setRefreshKey((prevKey) => prevKey + 1); // Déclenche un re-rendu
		}, [timerState])
	);

	useFocusEffect(
		useCallback(() => {
			// Vérifier si le minuteur est en cours d'exécution et continuer à décrémenter
			if (timerState.current && timerState.current.isRunning) {
				const interval = setInterval(() => {
					if (timerState.current) {
						timerState.current.timeLeft -= 1;
						setRefreshKey((prevKey) => prevKey + 1);
					}
				}, 1000);

				return () => clearInterval(interval);
			}
		}, [timerState])
	);

	const handleMethodPress = (method: Method) => {
		if (hasActiveSession) {
			Alert.alert(
				t("TIMER.TITLE"),
				t("Une session est déjà en cours. Termine-la avant d'en lancer une nouvelle."),
			);
			return;
		}
		if (method && method.id) {
			router.push(`/method/${method.id}`);
		}
	};

	const handleViewSession = () => {
		if (timerState.current && timerState.current.methodId) {
			router.push(`/method/${timerState.current.methodId}`);
		}
	};

	const handleStopSession = () => {
		Alert.alert(
			t("Arrêter la séance ?"),
			t("Es-tu sûr de vouloir arrêter la séance en cours ? Ta progression ne sera pas sauvegardée."),
			[
				{
					text: t("MODAL.CONFIRM.CANCEL_BUTTON"),
					style: "cancel",
				},
				{
					text: t("MODAL.CONFIRM.CONFIRM_BUTTON"),
					style: "destructive",
					onPress: async () => {
						if (timerState.current) {
							const session = {
								id: `${Date.now()}`,
								methodName: timerState.current.methodName ?? "",
								methodId: timerState.current.methodId ?? "",
								workDuration: timerState.current.workDurationMinutes,
								breakDuration: timerState.current.breakDurationMinutes,
								completedCycles: 0,
								totalWorkTime: Math.round(timerState.current.timeLeft / 60),
								totalBreakTime: 0,
								startTime: new Date(),
								endTime: new Date(),
								date: new Date().toISOString().split("T")[0],
								isCompleted: false,
							};
							await historyService.saveSession(session);
						}

						// Réinitialiser l'état du timer
						clearTimerState();
						setRefreshKey((prevKey) => prevKey + 1);
					},
				},
			],
		);
	};

	const formattedTime = timerState.current
		? `${Math.floor(timerState.current.timeLeft / 60)}:${(timerState.current.timeLeft % 60).toString().padStart(2, "0")}`
		: "0:00";

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
			<HeaderTitle title={t("CHOOSE_METHOD")} showDrawer />

			{/* Bloc visuel session en cours en haut */}
			{hasActiveSession && timerState.current && (
				<Pressable onPress={handleViewSession} style={styles.sessionBlock}>
					<Text style={styles.sessionTitle}>⏱️ {t("Séance en cours")}</Text>
					<Text style={styles.sessionMethod}>{timerState.current.methodName}</Text>
					<Text style={styles.sessionPhase}>
						{t("TIMER.PHASE." + timerState.current.phase.toUpperCase())} • {formattedTime} restantes
					</Text>
					<View style={styles.sessionButtonsRow}>
						<Pressable onPress={handleViewSession} style={styles.sessionViewButton}>
							<Text style={styles.sessionViewText}>{t("Voir la séance")}</Text>
						</Pressable>
						<Pressable onPress={handleStopSession} style={styles.sessionStopButton}>
							<Text style={styles.sessionStopText}>{t("Arrêter")}</Text>
						</Pressable>
					</View>
				</Pressable>
			)}

			{/* Message informatif si session en cours */}
			{hasActiveSession && (
				<View style={styles.infoBlock}>
					<Text style={[styles.infoText, { color: COLORS.textSecondary }]}>
						💡 {t("Les autres méthodes sont désactivées pendant ta séance")}
					</Text>
				</View>
			)}

			{/* Liste des méthodes, toutes désactivées si session en cours */}
			<FlatList
				data={allMethods}
				renderItem={({ item }) => (
					<MethodCard
						method={item}
						disabled={hasActiveSession}
						onPress={() => handleMethodPress(item)}
					/>
				)}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
			/>

			<FloatingActionButton onPress={() => setModalVisible(true)} disabled={hasActiveSession} />

			<AddMethodModal
				visible={modalVisible}
				onClose={() => setModalVisible(false)}
				onAdd={handleAddMethod}
			/>
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
		fontSize: 24,
		fontWeight: "700",
		marginBottom: 20,
		textAlign: "center",
	},
	list: {
		paddingBottom: 20,
	},
	sessionBlock: {
		marginBottom: 16,
		padding: 20,
		backgroundColor: "#4CAF50",
		borderRadius: 16,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	sessionTitle: {
		color: "#FFFFFF",
		fontWeight: "bold",
		fontSize: 16,
		marginBottom: 8,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	sessionMethod: {
		color: "#FFFFFF",
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 8,
	},
	sessionPhase: {
		color: "rgba(255, 255, 255, 0.9)",
		fontSize: 16,
		marginBottom: 12,
	},
	sessionButtonsRow: {
		flexDirection: "row",
		gap: 12,
		marginTop: 8,
	},
	sessionViewButton: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderWidth: 2,
		borderColor: "#FFFFFF",
	},
	sessionViewText: {
		color: "#4CAF50",
		fontWeight: "bold",
		fontSize: 16,
	},
	sessionStopButton: {
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderWidth: 2,
		borderColor: "#FFFFFF",
	},
	sessionStopText: {
		color: "#FFFFFF",
		fontWeight: "bold",
		fontSize: 16,
	},
	infoBlock: {
		marginBottom: 16,
		padding: 12,
		backgroundColor: "rgba(76, 175, 80, 0.1)",
		borderRadius: 12,
		borderLeftWidth: 4,
		borderLeftColor: "#4CAF50",
	},
	infoText: {
		fontSize: 14,
		textAlign: "center",
	},
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
