import type { ReactNode } from "react"

import { Text, View } from "react-native"

import { StatusBar } from "expo-status-bar"

export default function Page(): ReactNode {
	return (
		<View className="w-full flex-1 items-center justify-center bg-primary p-4">
			<StatusBar style="light" />
			{/* Coming soon */}
			<Text className="text-2xl text-white">Coming soon</Text>
		</View>
	)
}
