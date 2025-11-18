import i18n from "@/src/localization/i18n";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { TimerPhase } from "./useTimer";

// Configure default notification behaviors
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});

export class NotificationService {
	private static notificationId: string | null = null;
	private static lastUpdateTime: number = 0;
	private static readonly UPDATE_INTERVAL_MS = 5000; // Update every 5 seconds

	/**
	 * Request notification permissions
	 */
	static async requestPermissions(): Promise<boolean> {
		try {
			const { status: existingStatus } = await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;

			if (existingStatus !== "granted") {
				const { status } = await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}

			if (finalStatus !== "granted") {
				console.warn("Notification permissions not granted");
				return false;
			}

			// Configure notification channel for Android
			if (Platform.OS === "android") {
				await Notifications.setNotificationChannelAsync("timer", {
					name: "Timer",
					importance: Notifications.AndroidImportance.HIGH,
					sound: null,
					vibrationPattern: [0],
					enableVibrate: false,
					enableLights: false,
					lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
					bypassDnd: false,
					showBadge: false,
				});
			}

			return true;
		} catch (error) {
			console.error("Error requesting notification permissions:", error);
			return false;
		}
	}

	/**
	 * Show or update the timer notification (throttled)
	 */
	static async showTimerNotification(
		methodName: string,
		phase: TimerPhase,
		timeLeft: number,
		isRunning: boolean,
		force: boolean = false,
	): Promise<void> {
		try {
			// Throttle updates to avoid spam (except on force)
			const now = Date.now();
			if (!force && now - this.lastUpdateTime < this.UPDATE_INTERVAL_MS) {
				return;
			}
			this.lastUpdateTime = now;

			const minutes = Math.floor(timeLeft / 60);
			const seconds = timeLeft % 60;
			const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

			const phaseEmoji = phase === "work" ? "💼" : phase === "break" ? "☕" : "✅";
			const phaseLabel =
				phase === "work"
					? i18n.t("TIMER.PHASE.WORK")
					: phase === "break"
						? i18n.t("TIMER.PHASE.BREAK")
						: i18n.t("TIMER.PHASE.FINISHED");
			const statusIcon = isRunning ? "▶️" : "⏸️";

			const content: Notifications.NotificationContentInput = {
				title: `${phaseEmoji} ${methodName}`,
				body: `${statusIcon} ${phaseLabel} • ${timeString}`,
				sticky: true,
				priority: Notifications.AndroidNotificationPriority.HIGH,
				sound: undefined,
				vibrate: [],
				data: {
					type: "timer",
					methodName,
					phase,
					timeLeft,
					isRunning,
				},
			};

			if (Platform.OS === "android") {
				(content as any).channelId = "timer";
				(content as any).ongoing = true; // Make it non-dismissible on Android
			}

			// If notification already exists, update it
			if (this.notificationId) {
				await Notifications.dismissNotificationAsync(this.notificationId);
			}

			// Create new notification
			this.notificationId = await Notifications.scheduleNotificationAsync({
				content,
				trigger: null, // Show immediately
			});
		} catch (error) {
			console.error("Error showing timer notification:", error);
		}
	}

	/**
	 * Clear timer notification
	 */
	static async clearTimerNotification(): Promise<void> {
		try {
			if (this.notificationId) {
				await Notifications.dismissNotificationAsync(this.notificationId);
				this.notificationId = null;
			}
			// Also clear all timer notifications just in case
			const notifications = await Notifications.getPresentedNotificationsAsync();
			for (const notif of notifications) {
				if (notif.request.content.data?.type === "timer") {
					await Notifications.dismissNotificationAsync(notif.request.identifier);
				}
			}
		} catch (error) {
			console.error("Error clearing timer notification:", error);
		}
	}

	/**
	 * Show a simple notification for a timer event
	 */
	static async showTimerEvent(titleKey: string, bodyKey: string): Promise<void> {
		try {
			const hasPermission = await this.requestPermissions();
			if (!hasPermission) return;

			const content: Notifications.NotificationContentInput = {
				title: i18n.t(titleKey),
				body: i18n.t(bodyKey),
				sound: "default",
				priority: Notifications.AndroidNotificationPriority.HIGH,
			};

			if (Platform.OS === "android") {
				(content as any).channelId = "timer";
			}

			await Notifications.scheduleNotificationAsync({
				content,
				trigger: null,
			});
		} catch (error) {
			console.error("Error showing timer event:", error);
		}
	}

	/**
	 * Schedule a notification for when the timer ends
	 */
	static async scheduleTimerEndNotification(phase: TimerPhase, delayMs: number): Promise<void> {
		try {
			const hasPermission = await this.requestPermissions();
			if (!hasPermission) return;

			const titleKey =
				phase === "work"
					? "TIMER.NOTIFICATIONS.WORK_FINISHED"
					: "TIMER.NOTIFICATIONS.SESSION_COMPLETE";
			const bodyKey =
				phase === "work" ? "TIMER.NOTIFICATIONS.START_BREAK" : "TIMER.NOTIFICATIONS.GREAT_WORK";

			const content: Notifications.NotificationContentInput = {
				title: i18n.t(titleKey),
				body: i18n.t(bodyKey),
				sound: "default",
				priority: Notifications.AndroidNotificationPriority.HIGH,
				data: {
					type: "timer-end",
					phase,
				},
			};

			if (Platform.OS === "android") {
				(content as any).channelId = "timer";
			}

			await Notifications.scheduleNotificationAsync({
				content,
				trigger: {
					type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
					seconds: Math.ceil(delayMs / 1000),
					repeats: false,
				},
			});
		} catch (error) {
			console.error("Error scheduling timer end notification:", error);
		}
	}

	/**
	 * Cancel all scheduled timer notifications
	 */
	static async cancelScheduledNotifications(): Promise<void> {
		try {
			const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
			for (const notif of scheduledNotifications) {
				if (notif.content.data?.type === "timer-end") {
					await Notifications.cancelScheduledNotificationAsync(notif.identifier);
				}
			}
		} catch (error) {
			console.error("Error canceling scheduled notifications:", error);
		}
	}
}
