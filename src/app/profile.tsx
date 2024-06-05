import type { ReactNode } from "react"

import { Text, View } from "react-native"

export default function Page(): ReactNode {
	return (
		<View className="w-full flex-1 items-center justify-center bg-primary p-4">
			{/* Coming soon */}
			<Text className="text-2xl text-white">Coming soon</Text>
		</View>
	)
}
