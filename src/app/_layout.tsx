import type { ResourcesConfig } from "aws-amplify"

import { useEffect } from "react"

import { useFonts } from "expo-font"
import { router, Stack, usePathname } from "expo-router"
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"

import { Amplify } from "aws-amplify"

import * as config from "../amplifyconfiguration.json"

import "react-native-reanimated"
import "react-native-gesture-handler"

import FontAwesome from "@expo/vector-icons/FontAwesome"

import "../../global.css"

import { TouchableOpacity } from "react-native"

import { MaterialCommunityIcons } from "@expo/vector-icons"

import { SpaceMonoRegular } from "~/assets"
import { PlayerAvatar } from "~/components/ui"
import { AmplifyProvider } from "~/providers"
import { useAuthStore, useUserStore } from "~/stores"

Amplify.configure(config as ResourcesConfig)

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router"
export const unstable_settings = {
	initialRouteName: "/",
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
preventAutoHideAsync().catch((error) => {
	console.error(error)
})

const RootLayout = () => {
	const { clear } = useAuthStore()
	const { currentUser } = useUserStore()

	const [loaded, error] = useFonts({
		SpaceMono: SpaceMonoRegular,
		...FontAwesome.font,
	})

	const pathname = usePathname()

	useEffect(() => {
		if (error) throw error
	}, [error])

	useEffect(() => {
		if (loaded) {
			hideAsync().catch((error) => {
				console.error(error)
			})
		}
	}, [loaded])

	if (!loaded) {
		return null
	}

	return (
		<AmplifyProvider>
			<Stack
				screenOptions={{
					headerShown: false,

					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
			>
				<Stack.Screen
					name="index"
					options={{
						headerShown: true,
						headerShadowVisible: false,
						headerTitle: "",
						headerStyle: {
							backgroundColor: "#F2F3F3",
						},
						headerRight: () => {
							if (!currentUser) return

							return (
								<PlayerAvatar
									selfie={currentUser.selfie}
									onPress={() => {
										router.push("/profile")
									}}
									color={"#6D28D9"}
									size={40}
									className="flex items-center gap-2"
								/>
							)
						},
						headerLeft: () => (
							<TouchableOpacity
								onPress={() => {
									router.push("/settings")
								}}
							>
								<FontAwesome
									name="gear"
									color={"#6D28D9"}
									size={24}
								/>
							</TouchableOpacity>
						),
					}}
				/>
				<Stack.Screen
					name="auth"
					options={{
						presentation:
							pathname === "/auth/verification"
								? "transparentModal"
								: "modal",
						headerShadowVisible: false,
						headerBlurEffect: "light",
						headerStyle: {
							backgroundColor:
								pathname === "/auth/verification"
									? "#F9FAFB"
									: "#6D28D9",
						},
						headerShown: true,
						headerTitle: "",
						headerRight: () => (
							<TouchableOpacity
								className={"size-10"}
								onPress={() => {
									clear()
									router.back()
								}}
							>
								<MaterialCommunityIcons
									name="close"
									color={
										pathname === "/auth/verification"
											? "black"
											: "white"
									}
									size={24}
								/>
							</TouchableOpacity>
						),
					}}
				/>
				<Stack.Screen
					name="profile"
					options={{
						presentation: "modal",
						headerShown: true,
						headerShadowVisible: false,
						headerBlurEffect: "light",
						headerTitle: "Profile",
						headerStyle: {
							backgroundColor: "#F2F3F3",
						},
						headerLeft: () => (
							<TouchableOpacity
								onPress={() => {
									router.back()
								}}
							>
								<FontAwesome
									name="chevron-left"
									color={"#6D28D9"}
									size={24}
								/>
							</TouchableOpacity>
						),
					}}
				/>
				<Stack.Screen
					name="settings"
					options={{
						presentation: "modal",
						headerShown: true,
						headerShadowVisible: false,
						headerTitle: "Settings",
						headerStyle: {
							backgroundColor: "#F2F3F3",
						},
						headerLeft: () => (
							<TouchableOpacity
								onPress={() => {
									router.back()
								}}
							>
								<FontAwesome
									name="chevron-left"
									color={"#6D28D9"}
									size={24}
								/>
							</TouchableOpacity>
						),
					}}
				/>
			</Stack>
			<StatusBar />
		</AmplifyProvider>
	)
}

export default RootLayout
