import { Audio } from "expo-av";

class SoundManager {
	private isInitialized = false;

	async initializeAudio() {
		if (this.isInitialized) return;

		try {
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: false,
				playsInSilentModeIOS: true,
				staysActiveInBackground: false,
			});
			this.isInitialized = true;
		} catch (error) {
			console.log("Erreur lors de l'initialisation audio:", error);
		}
	}

	async playTransitionSound() {
		try {
			await this.initializeAudio();

			// Son de transition simple et court
			const { sound } = await Audio.Sound.createAsync(
				// Génération d'un son simple via data URI
				{
					uri: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuO2vTWdi0FJnzN8duMOggRZ7zr4oRO",
				},
				{ shouldPlay: true, volume: 0.6 },
			);

			// Décharger le son après lecture
			sound.setOnPlaybackStatusUpdate((status) => {
				if (status.isLoaded && status.didJustFinish) {
					sound.unloadAsync();
				}
			});
		} catch (error) {
			console.log("Erreur lors de la lecture du son de transition:", error);
		}
	}

	async playFinishSound() {
		try {
			await this.initializeAudio();

			// Son de fin plus long et distinctif
			const { sound } = await Audio.Sound.createAsync(
				{
					uri: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuO2vTWdi0FJnzN8duMOggRZ7zr4oRODAxXqOjytWEfBSmH0fPTgjkGHm7A7+OZSA0PVqzn77BdGAg+ltryxnkpBCl+zPLaizsIGGS57+OUTg0NUKXh8bllHgg2jdXzzn0vBSF0xe/glEoLDlOq5O+zYBoGPJPY88p9KwUme8rx3Y4+CRZiturll0wODVCl4fG5ZR4INozV8859LwUhdsXu4ZBJCw5TqeTvs2AaBjuR2PPKfSsFJXvK8d2OPgkWYbbq5BwFJnzN8duMOggRZ7zr4oRODAxXqOjytWEfBSmH0fPTgjkGHm7A7+OZSA0PVqzn77BdGAg+ltryxnkpBCl+zPLaizsIGGS57+OZSA0PVqzn77BdGAg+ltryxnkpBCl+zPLaizsIGGS57+OZSA0PVqzn77BdGAg+ltryxnkpBCl+zPLaizsIGGS57",
				},
				{ shouldPlay: true, volume: 0.8 },
			);

			// Décharger le son après lecture
			sound.setOnPlaybackStatusUpdate((status) => {
				if (status.isLoaded && status.didJustFinish) {
					sound.unloadAsync();
				}
			});
		} catch (error) {
			console.log("Erreur lors de la lecture du son de fin:", error);
		}
	}
}

export const soundManager = new SoundManager();
