import ToggleRow from "@/components/settings/ToggleRow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "@fokuz:cat_generator_enabled";

const CatGeneratorToggle: React.FC<{ onChange?: (enabled: boolean) => void }> = ({ onChange }) => {
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
			} catch {
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
		} catch {
			// ignore
		}
		if (onChange) onChange(value);
	};

	return (
		<ToggleRow
			title={t("CAT_CARD.TITLE")}
			subtitle={
				!loading
					? enabled
						? t("PLAYER_SETTINGS_STATUS.ACTIVE")
						: t("PLAYER_SETTINGS_STATUS.INACTIVE")
					: undefined
			}
			active={!loading && enabled}
			onToggle={() => toggle(!enabled)}
			iconName={"logo-octocat"}
		/>
	);
};

export default CatGeneratorToggle;
