import { methods } from "@/assets/data/methods";
import { LofiPlayer } from "@/components/media/LofiPlayer";
import { TimerComponent } from "@/components/timer/TimerComponent";
import BlockCard from "@/components/ui/BlockCard";
import { HeaderTitle } from "@/components/ui/HeaderTitle";
import { useThemeColors } from "@/constants/color";
import { useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from 'expo-screen-orientation';
import React from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function MethodDetails() {

	React.useEffect(() => {
		// allow rotation for this screen
		ScreenOrientation.unlockAsync().catch(() => { });

		return () => {
			// restore portrait lock when leaving
			ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => { });
		};
	}, []);

	const params = useLocalSearchParams();
	const id = params.id as string | undefined;
	const COLORS = useThemeColors();

	const method = methods.find((m) => m.id === id);

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
			<HeaderTitle title={method ? method.name : "Méthode non trouvée"} showBack />

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				{method ? (
					<>
						{/* Description Card */}
						<BlockCard>
							<Text style={[styles.description, { color: COLORS.text }]}>
								{method.description}
							</Text>
						</BlockCard>

						{/* Duration Info Card */}
						<BlockCard style={styles.durationCard}>
							<Text style={[styles.cardTitle, { color: COLORS.primary }]}>Configuration</Text>
							<View style={styles.durationRow}>
								<View style={[styles.durationItem, { borderLeftColor: COLORS.workColor }]}>
									<Text style={[styles.durationLabel, { color: COLORS.textSecondary }]}>Travail</Text>
									<Text style={[styles.durationValue, { color: COLORS.text }]}>{method.workDuration} min</Text>
								</View>
								{method.breakDuration && (
									<View style={[styles.durationItem, { borderLeftColor: COLORS.breakColor }]}>
										<Text style={[styles.durationLabel, { color: COLORS.textSecondary }]}>Pause</Text>
										<Text style={[styles.durationValue, { color: COLORS.text }]}>{method.breakDuration} min</Text>
									</View>
								)}
							</View>
						</BlockCard>

						{/* Lofi + Timer: stacked on portrait, side-by-side on landscape */}
						{(() => {
							const { width, height } = useWindowDimensions();
							const isLandscape = width > height;
							if (isLandscape) {
								return (
									<View style={styles.landscapeRow}>
										<View style={styles.landscapeHalf}>
											<BlockCard style={[styles.cardFill]}>
												<LofiPlayer />
											</BlockCard>
										</View>
										<View style={styles.landscapeHalf}>
											<BlockCard style={[styles.cardFill, styles.timerCard]}>
												<TimerComponent
													workDurationMinutes={method.workDuration}
													breakDurationMinutes={method.breakDuration}
													methodName={method.name}
													methodId={method.id}
												/>
											</BlockCard>
										</View>
									</View>
								);
							}
							return (
								<>
									{/* Portrait: stacked */}
									<LofiPlayer />
									<BlockCard style={[styles.card, styles.timerCard]}>
										<TimerComponent
											workDurationMinutes={method.workDuration}
											breakDurationMinutes={method.breakDuration}
											methodName={method.name}
											methodId={method.id}
										/>
									</BlockCard>
								</>
							);
						})()}
					</>
				) : (
					<BlockCard style={styles.card} padded={false}>
						<Text style={[styles.errorText, { color: COLORS.textSecondary }]}>
							Méthode non trouvée (id: {id})
						</Text>
					</BlockCard>
				)}
			</ScrollView>
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
	card: {
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
	},
	cardLight: {
		borderWidth: 1,
		borderColor: '#E5E7EB',
	},
	cardDark: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 8,
		elevation: 6,
	},
	description: {
		fontSize: 16,
		lineHeight: 24,
		textAlign: 'center',
	},
	durationCard: {
		marginBottom: 20,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 16,
		textAlign: 'center',
	},
	durationRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	durationItem: {
		alignItems: 'center',
		paddingLeft: 16,
		borderLeftWidth: 4,
		flex: 1,
		marginHorizontal: 8,
	},
	durationLabel: {
		fontSize: 14,
		fontWeight: '500',
		marginBottom: 4,
	},
	durationValue: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	timerCard: {
		alignItems: 'center',
	},
	landscapeRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		gap: 16,
		marginBottom: 16,
	},
	landscapeHalf: {
		flex: 1,
		minHeight: 300,
		marginHorizontal: 8,
	},
	cardFill: {
		flex: 1,
		paddingVertical: 12,
		justifyContent: 'center',
	},
	errorText: {
		fontSize: 16,
		textAlign: 'center',
	},
});
