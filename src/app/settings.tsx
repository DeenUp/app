import type { ReactNode } from "react"

import { View } from "react-native"
import { useModal } from "react-native-modalfy"

import { router } from "expo-router"

import { MaterialCommunityIcons } from "@expo/vector-icons"

import type { AuthStore } from "~/stores"

import { ThemedAwesomeButton } from "~/components/ui"
import { useAuthStore } from "~/stores"

export default function Page(): ReactNode {
	const { handleSignOut } = useAuthStore((store: AuthStore) => store)
	const { openModal } = useModal()

	return (
		<View className="w-full flex-1 items-center justify-center bg-primary px-6">
			<ThemedAwesomeButton
				theme="mysterion"
				type="danger"
				paddingTop={4}
				paddingHorizontal={4}
				borderRadius={100}
				onPress={() => {
					handleSignOut({
						onSignOut: () => {
							openModal("SuccessModal", {
								title: "Success",
								message: "You have been signed out",
								origin: "signin",
								onConfirm: () => {
									router.dismissAll()
								},
							})
						},
					})
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
