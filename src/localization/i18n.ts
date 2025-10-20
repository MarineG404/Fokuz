import AsyncStorage from "@react-native-async-storage/async-storage";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { en, fr } from "./translations";

const STORE_LANGUAGE_KEY = "settings.lang";

const languageDetectorPlugin: any = {
	type: "languageDetector",
	async: true,
	init: () => {},
	detect: async function (callback: (lang: string) => void) {
		try {
			// get stored language from Async storage
			// put your own language detection logic here
			await AsyncStorage.getItem(STORE_LANGUAGE_KEY).then((language) => {
				if (language) {
					return callback(language);
				} else {
					return callback("en");
				}
			});
		} catch {
			console.log("Error reading language");
		}
	},
	cacheUserLanguage: async function (language: string) {
		try {
			//save a user's language choice in Async storage
			await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
		} catch {}
	},
};
const resources = {
	en: {
		translation: en,
	},
	fr: {
		translation: fr,
	},
};

const i18n = createInstance();

i18n
	.use(initReactI18next)
	.use(languageDetectorPlugin)
	.init({
		resources,
		compatibilityJSON: "v4",
		// fallback language is set to english
		fallbackLng: "en",
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
