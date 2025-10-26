import ToggleRow from "@/components/settings/ToggleRow";
import { useThemeColors } from "@/constants/color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text } from "react-native";

const STORAGE_KEY = "@fokuz:lofi_enabled";

const PlayerSettingsToggle: React.FC = () => {
	const COLORS = useThemeColors();
	const { t } = useTranslation();
	const [enabled, setEnabled] = React.useState<boolean>(true);
	const [loading, setLoading] = React.useState<boolean>(true);

	React.useEffect(() => {
		(async () => {
			try {
				const raw = await AsyncStorage.getItem(STORAGE_KEY);
				if (raw === null) {
					await AsyncStorage.setItem(STORAGE_KEY, "true");
					setEnabled(true);
				} else {
					setEnabled(raw === "true");
				}
			} catch (e) {
				// ignore
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const toggle = async (value: boolean) => {
		setEnabled(value);
		try {
			await AsyncStorage.setItem(STORAGE_KEY, value ? "true" : "false");
		} catch (e) {
			// ignore
		}
	};

	return (
		<>
			<ToggleRow
				title={t("LOFI_PLAYER.TITLE")}
				subtitle={
					!loading
						? enabled
							? t("PLAYER_SETTINGS_STATUS.ACTIVE")
							: t("PLAYER_SETTINGS_STATUS.INACTIVE")
						: undefined
				}
				active={!loading && enabled}
				onToggle={() => toggle(!enabled)}
				iconName={"musical-notes"}
			/>

		</>
	);
};

export default PlayerSettingsToggle;
