import { Stack } from "expo-router";

export const unstable_settings = {
	anchor: "(drawer)",
};

export default function MethodLayout() {
	return (
		<Stack>
			<Stack.Screen name="[id]" options={{ headerShown: false }} />
		</Stack>
	);
}
