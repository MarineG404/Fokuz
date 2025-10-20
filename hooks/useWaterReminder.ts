import { waterReminderService } from "@/utils/waterReminderService";
import { useEffect, useState } from "react";

export function useWaterReminder() {
	const [isActive, setIsActive] = useState(false);

	const startReminders = async () => {
		await waterReminderService.startReminders();
		setIsActive(true);
	};

	const stopReminders = () => {
		waterReminderService.stopReminders();
		setIsActive(false);
	};

	const sendTestReminder = async () => {
		await waterReminderService.sendWaterReminder();
	};

	// Nettoyer au démontage du composant
	useEffect(() => {
		return () => {
			if (isActive) {
				waterReminderService.stopReminders();
			}
		};
	}, [isActive]);

	return {
		isActive,
		startReminders,
		stopReminders,
		sendTestReminder,
	};
}
