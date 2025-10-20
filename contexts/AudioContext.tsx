import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useAudioSounds } from "@/hooks/useAudioSounds";

type AudioContextType = {
	playTransitionSound: () => Promise<void>;
	playFinishSound: () => Promise<void>;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
	const { playTransitionSound, playFinishSound } = useAudioSounds();

	// Initialiser l'instance audio pour le soundManager
	useEffect(() => {
		setAudioInstance({ playTransitionSound, playFinishSound });
	}, [playTransitionSound, playFinishSound]);

	return (
		<AudioContext.Provider value={{ playTransitionSound, playFinishSound }}>
			{children}
		</AudioContext.Provider>
	);
}

export function useAudio() {
	const context = useContext(AudioContext);
	if (context === undefined) {
		throw new Error("useAudio must be used within an AudioProvider");
	}
	return context;
}

// Fonction utilitaire pour accéder aux sons depuis n'importe où sans hook
// (utilisera un singleton du contexte audio)
let audioInstance: AudioContextType | null = null;

export function setAudioInstance(instance: AudioContextType) {
	audioInstance = instance;
}

export const soundManager = {
	async playTransitionSound() {
		if (audioInstance) {
			await audioInstance.playTransitionSound();
		} else {
			console.log("🔊 Son de transition (audio non initialisé)");
		}
	},

	async playFinishSound() {
		if (audioInstance) {
			await audioInstance.playFinishSound();
		} else {
			console.log("🔊 Son de fin (audio non initialisé)");
		}
	},
};
