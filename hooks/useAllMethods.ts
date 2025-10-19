import type { Method } from "@/assets/data/methods";
import { methods } from "@/assets/data/methods";
import { useMemo } from "react";
import { useCustomMethods } from "./useCustomMethods";

export function useAllMethods() {
	const { customMethods, loading } = useCustomMethods();

	const allMethods = useMemo(() => {
		return [...methods, ...customMethods];
	}, [customMethods]);

	const getMethodById = (id: string): Method | undefined => {
		return allMethods.find((m) => m.id === id);
	};

	return {
		allMethods,
		loading,
		getMethodById,
	};
}
