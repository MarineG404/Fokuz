import type { Method } from "@/assets/data/methods";
import { MethodCard } from "@/components/cards/MethodCard";
import { AddMethodModal } from "@/components/modals/AddMethodModal";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { HeaderTitle } from "@/components/ui/HeaderTitle";
import { useThemeColors } from "@/constants/color";
import { useAllMethods } from "@/hooks/useAllMethods";
import { useCustomMethods } from "@/hooks/useCustomMethods";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
	const COLORS = useThemeColors();
	const { allMethods } = useAllMethods();
	const { addCustomMethod } = useCustomMethods();
	const [modalVisible, setModalVisible] = useState(false);

	const handleAddMethod = async (method: Omit<Method, "id">) => {
		await addCustomMethod(method);
	};

	const { t } = useTranslation();

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
			<HeaderTitle title={t("CHOOSE_METHOD")} showDrawer />
			<FlatList
				data={allMethods}
				renderItem={({ item }) => <MethodCard method={item} />}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
			/>
			<FloatingActionButton onPress={() => setModalVisible(true)} />
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
