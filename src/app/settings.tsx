import type { ReactNode } from "react"

import { View } from "react-native"
import { useModal } from "react-native-modalfy"

import { router } from "expo-router"

import { MaterialCommunityIcons } from "@expo/vector-icons"

import type { AuthStore } from "~/stores"

import { ThemedAwesomeButton } from "~/components/ui"
import { useAuthStore, useSettingsStore } from "~/stores"

export default function Page(): ReactNode {
	const { handleSignOut, currentUser } = useAuthStore(
		(store: AuthStore) => store,
	)
	const { translate } = useSettingsStore()
	const { openModal } = useModal()

	const onSignOut = () => {
		openModal("AlertModal", {
			title: "Sign Out",
			message: translate("notifications.signOut.confirmation"),

			onConfirm: () => {
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
			},
		})
	}

	return (
		<View className="w-full flex-1 items-center justify-center gap-6 bg-primary px-6">
			<ThemedAwesomeButton
				theme="mysterion"
				type="anchor"
				paddingTop={4}
				paddingHorizontal={4}
				borderRadius={100}
				width={300}
				textSize={24}
				onPress={() => router.navigate("/auth/")}
				after={
					<MaterialCommunityIcons
						name="login"
						color={"white"}
						size={24}
					/>
				}
				textColor="white"
			>
				Log In
			</ThemedAwesomeButton>

			{currentUser && (
				<ThemedAwesomeButton
					theme="mysterion"
					type="danger"
					paddingTop={4}
					paddingHorizontal={4}
					borderRadius={100}
					onPress={() => onSignOut}
					textSize={24}
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
			)}
		</View>
	)
}
