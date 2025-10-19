import { Method } from "@/assets/data/methods";
import { useThemeColors } from "@/constants/color";
import { useCustomMethods } from "@/hooks/useCustomMethods";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EditMethodModal } from "../modals/EditMethodModal";
import BlockCard from "../ui/BlockCard";

export const MethodCard = ({ method }: { method: Method }) => {
	const COLORS = useThemeColors();
	const router = useRouter();
	const { updateCustomMethod, deleteCustomMethod } = useCustomMethods();
	const [editModalVisible, setEditModalVisible] = useState(false);

	const isCustomMethod = method.id.startsWith("custom_");

	const onPress = () => {
		router.push(`/method/${method.id}` as any);
	};

	const handleEdit = () => {
		setEditModalVisible(true);
	};

	const handleUpdate = async (updatedMethod: Method) => {
		await updateCustomMethod(updatedMethod);
	};

	const handleDelete = () => {
		Alert.alert("Supprimer la méthode", `Voulez-vous vraiment supprimer "${method.name}" ?`, [
			{
				text: "Annuler",
				style: "cancel",
			},
			{
				text: "Supprimer",
				style: "destructive",
				onPress: async () => {
					await deleteCustomMethod(method.id);
				},
			},
		]);
	};

	return (
		<TouchableOpacity onPress={onPress}>
			<BlockCard style={styles.card}>
				<Ionicons name={method.icon} size={40} color={COLORS.secondary} style={styles.icon} />
				<View style={styles.textContainer}>
					<Text style={[styles.name, { color: COLORS.text }]}>{method.name}</Text>
					<Text style={[styles.description, { color: COLORS.textSecondary }]}>
						{method.workDuration} min de travail
						{method.breakDuration ? `, ${method.breakDuration} min de pause` : ""}
					</Text>
				</View>
				{isCustomMethod && (
					<View style={styles.actionsContainer}>
						<Pressable
							onPress={handleEdit}
							style={[styles.actionButton, { backgroundColor: COLORS.mutedButton }]}
							hitSlop={8}
						>
							<Ionicons name="pencil-outline" size={20} color={COLORS.textSecondary} />
						</Pressable>
						<Pressable
							onPress={handleDelete}
							style={[styles.actionButton, { backgroundColor: COLORS.mutedButton }]}
							hitSlop={8}
						>
							<Ionicons name="trash-outline" size={20} color={COLORS.textSecondary} />
						</Pressable>
					</View>
				)}
			</BlockCard>
			{isCustomMethod && (
				<EditMethodModal
					visible={editModalVisible}
					onClose={() => setEditModalVisible(false)}
					onUpdate={handleUpdate}
					method={method}
				/>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	icon: { marginRight: 16 },
	textContainer: { flex: 1 },
	name: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
	description: { fontSize: 14 },
	actionsContainer: {
		flexDirection: "row",
		gap: 8,
	},
	actionButton: {
		padding: 8,
		borderRadius: 8,
	},
});

export default MethodCard;
