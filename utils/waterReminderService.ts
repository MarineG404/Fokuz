import i18n from "@/src/localization/i18n";
import Constants from "expo-constants";
import { Platform } from "react-native";

const isExpoGo = Constants.appOwnership === "expo";

let Notifications: any = null;
if (!isExpoGo) {
	try {
		Notifications = require("expo-notifications");
		Notifications.setNotificationHandler({
			handleNotification: async () => ({
				shouldShowAlert: true,
				shouldPlaySound: true,
				shouldSetBadge: false,
				shouldShowBanner: true,
				shouldShowList: true,
			}),
		});
	} catch (error) {
		console.log("expo-notifications non disponible");
	}
}

class WaterReminderService {
	private reminderInterval: ReturnType<typeof setTimeout> | null = null;
	private isActive = false;

	async requestPermissions() {
		if (isExpoGo) {
			console.log("💧 Mode Expo Go: Notifications simulées");
			return true;
		}

		if (!Notifications) {
			console.log("Notifications non disponibles");
			return false;
		}

		try {
			if (Platform.OS === "android") {
				await Notifications.setNotificationChannelAsync("water-reminder", {
					name: "Water Reminders",
					importance: Notifications.AndroidImportance.DEFAULT,
					vibrationPattern: [0, 250, 250, 250],
					lightColor: "#4A90E2",
				});
			}

			const { status } = await Notifications.requestPermissionsAsync();
			return status === "granted";
		} catch (error) {
			console.log("Erreur permission notifications:", error);
			return false;
		}
	}

	async startReminders() {
		if (this.isActive) return;

		const hasPermission = await this.requestPermissions();
		if (!hasPermission) {
			console.log("Permission notifications refusée");
			return;
		}

		this.isActive = true;

		this.scheduleNextReminder();
	}

	private scheduleNextReminder() {
		if (!this.isActive) return;

		const minMinutes = 2;
		const maxMinutes = 4;
		const randomMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
		const intervalMs = randomMinutes * 60 * 1000;

		this.reminderInterval = setTimeout(async () => {
			await this.sendWaterReminder();
			this.scheduleNextReminder();
		}, intervalMs);
	}

	async sendWaterReminder() {
		if (isExpoGo) {
			const title = i18n.t("WATER_REMINDER.NOTIFICATIONS.TITLE");
			const messages = i18n.t("WATER_REMINDER.NOTIFICATIONS.MESSAGES", {
				returnObjects: true,
			}) as string[];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];

			console.log(`🚨 NOTIFICATION SIMULÉE 🚨`);
			console.log(`📱 ${title}`);
			console.log(`💬 ${randomMessage}`);
			console.log(`⏰ ${new Date().toLocaleTimeString()}`);
			return;
		}

		if (!Notifications) {
			console.log("Notifications non disponibles");
			return;
		}

		try {
			const title = i18n.t("WATER_REMINDER.NOTIFICATIONS.TITLE");
			const messages = i18n.t("WATER_REMINDER.NOTIFICATIONS.MESSAGES", {
				returnObjects: true,
			}) as string[];

			const randomMessage = messages[Math.floor(Math.random() * messages.length)];

			await Notifications.scheduleNotificationAsync({
				content: {
					title: title,
					body: randomMessage,
					sound: true,
					data: { type: "water-reminder" },
				},
				trigger: null,
			});
		} catch (error) {
			console.log("Erreur envoi notification:", error);
		}
	}

	stopReminders() {
		this.isActive = false;
		if (this.reminderInterval) {
			clearTimeout(this.reminderInterval);
			this.reminderInterval = null;
		}

		if (isExpoGo) {
			console.log("💧 Rappels d'hydratation arrêtés (mode Expo Go)");
			return;
		}

		if (Notifications) {
			Notifications.cancelAllScheduledNotificationsAsync();
		}
	}
}

export const waterReminderService = new WaterReminderService();
