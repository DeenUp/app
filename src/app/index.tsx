import type { ReactNode } from "react"

import { SafeAreaView, View } from "react-native"

import * as Haptics from "expo-haptics"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import { MotiImage, MotiView } from "moti"
import twr from "twrnc"

import DeenUp from "~/assets/images/deenup.png"
import { Spacer, ThemedAwesomeButton } from "~/components/ui"
import { tw } from "~/helpers"
import { useAuthStore, useSettingsStore } from "~/stores"

export default function Page(): ReactNode {
	const currentUser = useAuthStore((state) => state.currentUser)
	const { theme } = useSettingsStore()

	const styles = {
		body: twr`flex-1 bg-[${theme.primary}]`,
		container: tw`flex h-full flex-col bg-primary`,
		logoContainer: tw`items-center`,
		playButtonsContainer: tw`flex w-full flex-row items-center justify-center gap-2 px-1`,
		logo: twr`flex flex-col items-center justify-center text-center text-8xl font-bold`,
		motiContainer: twr`-mb-8 flex w-full items-center justify-start gap-2 gap-4 rounded-3xl bg-[#F9F2DF] p-6`,
	}

	return (
		<SafeAreaView style={styles.body}>
			<StatusBar style="light" />

			<View className={styles.container}>
				<Spacer />
				<View className={styles.logoContainer}>
					<MotiImage
						style={styles.logo}
						from={{ opacity: 0, translateY: 200, scale: 0.5 }}
						animate={{ opacity: 1, translateY: 0, scale: 1.5 }}
						transition={{
							scale: { type: "spring", delay: 350 },
						}}
						source={DeenUp}
					/>
				</View>
				<Spacer />
				<MotiView
					from={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: 300 }}
					style={styles.motiContainer}
					transition={{
						type: "spring",
						delay: 200,
					}}
				>
					<View className={styles.playButtonsContainer}>
						<ThemedAwesomeButton
							type="anchor"
							size="large"
							width={170}
							height={70}
							borderTopRightRadius={0}
							borderBottomRightRadius={0}
							onPress={() => {
								Haptics.impactAsync(
									Haptics.ImpactFeedbackStyle.Rigid,
								)
								if (currentUser) {
									router.push("/join-game")
								} else {
									router.push("/auth/")
								}
							}}
							textSize={20}
						>
							Join Game
						</ThemedAwesomeButton>

						<ThemedAwesomeButton
							type="anchor"
							size="large"
							width={170}
							height={70}
							borderTopLeftRadius={0}
							borderBottomLeftRadius={0}
							onPressOut={() => {
								Haptics.impactAsync(
									Haptics.ImpactFeedbackStyle.Rigid,
								)
								if (currentUser) {
									router.push("/create-game")
								} else {
									router.push("/auth/")
								}
							}}
							textSize={20}
						>
							Create Game
						</ThemedAwesomeButton>
					</View>
					<ThemedAwesomeButton
						type="anchor"
						size="large"
						onPress={() => {
							Haptics.impactAsync(
								Haptics.ImpactFeedbackStyle.Rigid,
							)
							router.push("/solo-mode")
						}}
						width={350}
						height={70}
						textSize={20}
					>
						Solo Mode
					</ThemedAwesomeButton>
					<View className="flex w-full flex-row items-center justify-between px-3">
						<ThemedAwesomeButton
							type="anchor"
							size="small"
							width={60}
							height={50}
							onPress={() => {
								Haptics.impactAsync(
									Haptics.ImpactFeedbackStyle.Rigid,
								)
								router.push("/settings")
							}}
						>
							<MaterialCommunityIcons
								name="gamepad-circle-outline"
								size={24}
								color="black"
							/>
						</ThemedAwesomeButton>
						<ThemedAwesomeButton
							type="anchor"
							size="small"
							width={50}
							height={50}
							onPress={() => {
								Haptics.impactAsync(
									Haptics.ImpactFeedbackStyle.Rigid,
								)
								router.push("/profile")
							}}
						>
							<MaterialCommunityIcons
								name="face-man-profile"
								size={20}
								color="black"
							/>
						</ThemedAwesomeButton>
					</View>
				</MotiView>
			</View>
		</SafeAreaView>
	)
}
