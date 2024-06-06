import { useEffect } from "react"
import { Platform } from "react-native"

import { useFonts } from "expo-font"
import { router, Stack, usePathname } from "expo-router"
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"

import { Amplify } from "aws-amplify"

import { useSettingsStore } from "~/stores"

import "react-native-reanimated"
import "react-native-gesture-handler"

import FontAwesome from "@expo/vector-icons/FontAwesome"

import "../../global.css"

import { TouchableOpacity } from "react-native"

import { SpaceMonoRegular } from "~/assets"
import { CloseButton } from "~/components/ui"
import { getAmplifyConfig } from "~/configs"
import { AmplifyProvider } from "~/providers"
import { useAuthStore, useGameStore } from "~/stores"

Amplify.configure(getAmplifyConfig())

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
	const { theme } = useSettingsStore()
	const { joinExistingLobby } = useGameStore()

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
						headerShown: false,
					}}
				/>

				<Stack.Screen
					name="auth"
					options={{
						presentation:
							pathname === "/auth/verification"
								? "modal"
								: "modal",
						headerShadowVisible: false,
						headerBlurEffect: "light",
						headerStyle: {
							backgroundColor:
								pathname === "/auth/verification"
									? "#F9FAFB"
									: "#472836",
						},
						headerShown: true,
						headerTitle: "",

						headerLeft: () => (
							<TouchableOpacity
								className={"size-1"}
								onPress={() => {
									clear()
									router.back()
								}}
							/>
						),

						headerRight: () => (
							<CloseButton
								onPress={() => {
									clear()
									router.back()
								}}
							/>
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
						headerTitleStyle: {
							color: theme.primary,
						},
						headerStyle: {
							backgroundColor: theme.primary,
						},
						headerLeft: () => (
							<TouchableOpacity
								onPress={() => {
									router.back()
								}}
							>
								<FontAwesome
									name="chevron-left"
									color={theme.surface}
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
						headerTitleStyle: {
							color: theme.primary,
						},
						headerStyle: {
							backgroundColor: theme.primary,
						},
						headerLeft: () => (
							<TouchableOpacity
								onPress={() => {
									router.back()
								}}
							>
								<FontAwesome
									name="chevron-left"
									color={theme.surface}
									size={24}
								/>
							</TouchableOpacity>
						),
					}}
				/>
				<Stack.Screen
					name="solo-mode"
					options={{
						presentation: "fullScreenModal",
						headerShown: false,
						headerTitle: "",
						headerStyle: {
							backgroundColor: "#472836",
						},
						headerShadowVisible: false,

						headerLeft: () => (
							<TouchableOpacity
								className={"size-1"}
								onPress={() => {
									clear()
									router.back()
								}}
							/>
						),
					}}
				/>
			</Stack>
			<StatusBar />
		</AmplifyProvider>
	)
}

export default RootLayout
