import { useThemeColors } from "@/constants/color";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';


const options = [
	{ value: "fr", label: "Français" },
	{ value: "en", label: "English" },
];

export const LanguageSwitcher = () => {
	const COLORS = useThemeColors();
	const { i18n } = useTranslation();

	return (
		<View style={styles.container}>
			<Dropdown
				data={options}
				value={i18n.language}
				onChange={item => i18n.changeLanguage(item.value)}
				labelField="label"
				valueField="value"
				style={[styles.dropdown, {
					borderColor: COLORS.primary,
					backgroundColor: COLORS.card
				}]}
				selectedTextStyle={[styles.selectedText, { color: COLORS.text }]}
				containerStyle={[styles.listContainer, {
					backgroundColor: COLORS.card,
					borderColor: COLORS.border,
					borderWidth: 1
				}]}
				placeholderStyle={{ color: COLORS.text }}
				itemTextStyle={{ color: COLORS.text }}
				activeColor={COLORS.primary + "15"}
				iconStyle={styles.icon}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: 8,
		minWidth: 140,
	},
	dropdown: {
		height: 40,
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 12,
	},
	selectedText: {
		fontSize: 14,
		fontWeight: "600",
	},
	listContainer: {
		borderRadius: 8,
		marginTop: 4,
	},
	icon: {
		width: 20,
		height: 20,
	},
});
