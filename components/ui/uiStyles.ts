import { StyleSheet } from "react-native";

export const uiStyles = StyleSheet.create({
	card: {
		borderRadius: 16,
		marginBottom: 16,
	},
	cardPadded: {
		padding: 20,
	},
	cardLight: {
		borderWidth: 1,
		borderColor: "#E5E7EB",
	},
	cardDark: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 8,
		elevation: 6,
	},
});
