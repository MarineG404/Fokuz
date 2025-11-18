import { useThemeColors } from "@/constants/color";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text } from "react-native";
import BlockCard from "./BlockCard";

interface EncouragementBoxProps {
	style?: any;
	textStyle?: any;
}

export const EncouragementBox: React.FC<EncouragementBoxProps> = ({ style, textStyle }) => {
	const { t } = useTranslation();
	const COLORS = useThemeColors();
	const encouragements = t("ENCOURAGEMENTS", { returnObjects: true }) as string[];
	const [encouragement, setEncouragement] = useState<string | null>(() => {
		if (!encouragements || encouragements.length === 0) return null;
		return encouragements[Math.floor(Math.random() * encouragements.length)];
	});
	const intervalRef = useRef<number | null>(null);

	useEffect(() => {
		function pickRandom() {
			if (!encouragements || encouragements.length === 0) return;
			setEncouragement((prev) => {
				let next = prev;
				while (encouragements.length > 1 && next === prev) {
					next = encouragements[Math.floor(Math.random() * encouragements.length)];
				}
				return next;
			});
		}
		function scheduleNext() {
			const delay = 60000 + Math.floor(Math.random() * 60000); // 60s à 120s
			intervalRef.current = setTimeout(() => {
				pickRandom();
				scheduleNext();
			}, delay) as unknown as number;
		}
		scheduleNext();
		return () => {
			if (intervalRef.current) clearTimeout(intervalRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [encouragements.length]);

	if (!encouragement) return null;
	return (
		<BlockCard>
			<Text style={[styles.text, { color: COLORS.text }, textStyle]}>{encouragement}</Text>
		</BlockCard>
	);
};

const styles = StyleSheet.create({
	box: {
		backgroundColor: "rgba(255,255,255,0.15)",
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 18,
		marginBottom: 10,
		marginTop: 4,
		alignSelf: "stretch",
		alignItems: "center",
	},
	text: {
		fontSize: 16,
		fontWeight: "600",
		textAlign: "center",
	},
});

export default EncouragementBox;
