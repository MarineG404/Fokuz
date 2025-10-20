import type { Method } from "@/assets/data/methods";
import { methods } from "@/assets/data/methods";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCustomMethods } from "./useCustomMethods";

export function useAllMethods() {
	const { customMethods, loading } = useCustomMethods();
	const { t } = useTranslation();

	const allMethods = useMemo(() => {
		// Pour les méthodes prédéfinies, on ajoute le nom et la description traduits
		const translatedMethods = methods.map((m) => {
			if ("translationKey" in m) {
				return {
					...m,
					name: t(`METHODS.${m.translationKey}.NAME`),
					description: t(`METHODS.${m.translationKey}.DESCRIPTION`),
				};
			}
			return m;
		});
		return [...translatedMethods, ...customMethods];
	}, [customMethods, t]);

	const getMethodById = (id: string): Method | undefined => {
		const method = allMethods.find((m) => m.id === id);
		if (!method) return undefined;

		if ("translationKey" in method) {
			return {
				...method,
				name: t(`METHODS.${method.translationKey}.NAME`),
				description: t(`METHODS.${method.translationKey}.DESCRIPTION`),
			};
		}

		return method;
	};

	return {
		allMethods,
		loading,
		getMethodById,
	};
}
