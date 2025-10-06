import { methods } from "@/assets/data/methods";
import { HeaderTitle } from "@/components/HeaderTitle";
import { MethodCard } from "@/components/MethodCard";
import { useThemeColors } from "@/constants/color";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
	const COLORS = useThemeColors();
	return (
		<SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
			<HeaderTitle title="Choisis ta méthode" showDrawer />
			<FlatList
				data={methods}
				renderItem={({ item }) => <MethodCard method={item} />}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
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
