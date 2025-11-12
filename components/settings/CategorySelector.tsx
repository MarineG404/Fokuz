import TYPOGRAPHY from '@/constants/typography';
import { LOFI_VIDEOS } from "@/assets/data/lofiVideos";
import { useThemeColors } from "@/constants/color";
import { SPACING } from "@/constants/spacing";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const STORAGE_KEY = "@fokuz:lofi_categories";

function uniqueCategories() {
	const set = new Set<string>();
	LOFI_VIDEOS.forEach((v) => v.category.forEach((c) => set.add(c)));
	return Array.from(set).sort();
}

type Props = {
	compact?: boolean;
};

export default function CategorySelector({ compact = false }: Props) {
	const COLORS = useThemeColors();
	const { t } = useTranslation();
	const [selected, setSelected] = React.useState<string[] | null>(null);

	React.useEffect(() => {
		(async () => {
			try {
				const raw = await AsyncStorage.getItem(STORAGE_KEY);
				if (!raw) {
					setSelected([]); // default: none selected => show all
				} else {
					setSelected(JSON.parse(raw));
				}
			} catch {
				setSelected([]);
			}
		})();
	}, []);

	const toggle = async (cat: string) => {
		const next = new Set(selected || []);
		if (next.has(cat)) next.delete(cat);
		else next.add(cat);
		const arr = Array.from(next);
		setSelected(arr);
		try {
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
		} catch {
			// ignore
		}
	};

	const cats = uniqueCategories();

	if (selected === null) return null; // still loading

	if (compact) {
		return (
			<View>
				<FlatList
					data={cats}
					keyExtractor={(item) => item}
					numColumns={2}
					columnWrapperStyle={{ justifyContent: "space-between" }}
					renderItem={({ item }) => {
						const active = (selected || []).includes(item);
						return (
							<Pressable
								onPress={() => toggle(item)}
								style={[
									styles.compactChip,
									{
										backgroundColor: active ? COLORS.primary : COLORS.card,
										borderColor: COLORS.border,
									},
								]}
							>
								<Text
									style={[styles.compactText, { color: active ? COLORS.background : COLORS.text }]}
								>
									{item}
								</Text>
							</Pressable>
						);
					}}
				/>
			</View>
		);
	}

	return (
		<View>
			<Text style={[styles.title, { color: COLORS.secondary }]}>
				{t("PLAYER_SETTINGS.CATEGORIES")}
			</Text>
			<FlatList
				data={cats}
				keyExtractor={(item) => item}
				renderItem={({ item }) => {
					const active = (selected || []).includes(item);
					return (
						<Pressable
							onPress={() => toggle(item)}
							style={[styles.row, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}
						>
							<Text style={[styles.catText, { color: COLORS.text }]}>{item}</Text>
							<Ionicons
								name={active ? "checkmark-circle" : "ellipse-outline"}
								size={20}
								color={active ? COLORS.primary : COLORS.textSecondary}
							/>
						</Pressable>
					);
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	title: { fontSize: TYPOGRAPHY.sizes.base, fontWeight: "700" },
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderRadius: SPACING.radius,
		borderWidth: 1,
		padding: SPACING.large,
	},
	catText: { fontSize: TYPOGRAPHY.sizes.lg, fontWeight: TYPOGRAPHY.weights.semibold },
	compactChip: {
		borderRadius: 999,
		minWidth: "48%",
		alignItems: "center",
		paddingVertical: SPACING.small,
		paddingHorizontal: SPACING.medium,
		marginBottom: SPACING.small,
	},
	compactText: { fontSize: TYPOGRAPHY.sizes.sm, fontWeight: TYPOGRAPHY.weights.semibold },
});
