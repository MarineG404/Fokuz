import type { Method } from "@/assets/data/methods";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "@fokuz:custom_methods";

type CustomMethodsContextType = {
	customMethods: Method[];
	loading: boolean;
	addCustomMethod: (method: Omit<Method, "id">) => Promise<Method>;
	updateCustomMethod: (method: Method) => Promise<void>;
	deleteCustomMethod: (id: string) => Promise<void>;
	refreshMethods: () => Promise<void>;
};

const CustomMethodsContext = createContext<CustomMethodsContextType | undefined>(undefined);

export function CustomMethodsProvider({ children }: { children: React.ReactNode }) {
	const [customMethods, setCustomMethods] = useState<Method[]>([]);
	const [loading, setLoading] = useState(true);

	const loadCustomMethods = async () => {
		try {
			const stored = await AsyncStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				setCustomMethods(parsed);
			}
		} catch (error) {
			console.error("Erreur lors du chargement des méthodes custom:", error);
		} finally {
			setLoading(false);
		}
	};

	// Charger les méthodes au démarrage
	useEffect(() => {
		loadCustomMethods();
	}, []);

	const addCustomMethod = async (method: Omit<Method, "id">) => {
		try {
			const newMethod: Method = {
				...method,
				id: `custom_${Date.now()}`,
			};

			const updated = [...customMethods, newMethod];
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
			setCustomMethods(updated);
			return newMethod;
		} catch (error) {
			console.error("Erreur lors de l'ajout d'une méthode:", error);
			throw error;
		}
	};

	const updateCustomMethod = async (method: Method) => {
		try {
			const updated = customMethods.map((m) => (m.id === method.id ? method : m));
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
			setCustomMethods(updated);
		} catch (error) {
			console.error("Erreur lors de la modification d'une méthode:", error);
			throw error;
		}
	};

	const deleteCustomMethod = async (id: string) => {
		try {
			const updated = customMethods.filter((m) => m.id !== id);
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
			setCustomMethods(updated);
		} catch (error) {
			console.error("Erreur lors de la suppression d'une méthode:", error);
			throw error;
		}
	};

	const refreshMethods = async () => {
		await loadCustomMethods();
	};

	return (
		<CustomMethodsContext.Provider
			value={{
				customMethods,
				loading,
				addCustomMethod,
				updateCustomMethod,
				deleteCustomMethod,
				refreshMethods,
			}}
		>
			{children}
		</CustomMethodsContext.Provider>
	);
}

export function useCustomMethods() {
	const context = useContext(CustomMethodsContext);
	if (context === undefined) {
		throw new Error("useCustomMethods must be used within a CustomMethodsProvider");
	}
	return context;
}
