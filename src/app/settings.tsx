import type { ReactNode } from "react"

import { View } from "react-native"

import { MaterialCommunityIcons } from "@expo/vector-icons"

import type { AuthStore } from "~/stores"

import { ThemedAwesomeButton } from "~/components/ui"
import { useAuthStore } from "~/stores"

export default function Page(): ReactNode {
	const { handleSignOut } = useAuthStore((store: AuthStore) => store)

	return (
		<View className="px-6">
			<ThemedAwesomeButton
				theme="mysterion"
				type="danger"
				stretch
				paddingTop={4}
				paddingHorizontal={4}
				borderRadius={100}
				onPress={() => {
					handleSignOut()
				}}
				before={
					<MaterialCommunityIcons
						name="logout"
						color={"white"}
						size={18}
					/>
				}
				textColor="white"
			>
				Log Out
			</ThemedAwesomeButton>
		</View>
	)
}
