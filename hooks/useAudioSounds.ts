import { useAudioPlayer, AudioSource } from "expo-audio";
import { useCallback } from "react";

// Sons générés en base64 (simples bips)
const TRANSITION_SOUND: AudioSource = {
	uri: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuO2vTWdi0FJnzN8duMOggRZ7zr4oRO",
};

const FINISH_SOUND: AudioSource = {
	uri: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuO2vTWdi0FJnzN8duMOggRZ7zr4oRODAxXqOjytWEfBSmH0fPTgjkGHm7A7+OZSA0PVqzn77BdGAg+ltryxnkpBCl+zPLaizsIGGS57+OUTg0NUKXh8bllHgg2jdXzzn0vBSF0xe/glEoLDlOq5O+zYBoGPJPY88p9KwUme8rx3Y4+CRZiturll0wODVCl4fG5ZR4INozV8859LwUhdsXu4ZBJCw5TqeTvs2AaBjuR2PPKfSsFJXvK8d2OPgkWYbbq5BwFJnzN8duMOggRZ7zr4oRODAxXqOjytWEfBSmH0fPTgjkGHm7A7+OZSA0PVqzn77BdGAg+ltryxnkpBCl+zPLaizsIGGS57+OZSA0PVqzn77BdGAg+ltryxnkpBCl+zPLaizsIGGS57+OZSA0PVqzn77BdGAg+ltryxnkpBCl+zPLaizsIGGS57",
};

export function useAudioSounds() {
	// Players pour les deux types de sons
	const transitionPlayer = useAudioPlayer(TRANSITION_SOUND);
	const finishPlayer = useAudioPlayer(FINISH_SOUND);

	const playTransitionSound = useCallback(async () => {
		try {
			if (transitionPlayer.isLoaded) {
				transitionPlayer.volume = 0.6;
				await transitionPlayer.seekTo(0); // Remettre au début
				transitionPlayer.play();
			}
		} catch (error) {
			console.log("Erreur son de transition:", error);
		}
	}, [transitionPlayer]);

	const playFinishSound = useCallback(async () => {
		try {
			if (finishPlayer.isLoaded) {
				finishPlayer.volume = 0.8;
				await finishPlayer.seekTo(0); // Remettre au début
				finishPlayer.play();
			}
		} catch (error) {
			console.log("Erreur son de fin:", error);
		}
	}, [finishPlayer]);

	return {
		playTransitionSound,
		playFinishSound,
	};
}
