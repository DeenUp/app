import type { ReactNode } from "react"

import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"

import { MotiView } from "moti"
import twr from "twrnc"

import { Button, Spacer } from "~/components/ui"
import { tw } from "~/helpers"
import { useAuthStore } from "~/stores"

export default function Page(): ReactNode {
	const currentUser = useAuthStore((state) => state.currentUser)

	const styles = {
		body: tw`flex h-full flex-col `,
		logoContainer: tw`items-center`,
		logo: tw`text-8xl font-bold`,
		logoPrimary: tw`text-8xl font-bold text-primary`,
		playButtonsContainer: tw`flex w-full flex-row items-center justify-center gap-2 px-1`,
		joinGameButton: tw`w-1/2 rounded-3xl rounded-r-none`,
		createGameButton: tw`w-1/2 rounded-3xl rounded-l-none border-base-300`,
		motiLogo: twr`flex flex-col items-center justify-center text-center text-8xl font-bold`,
		motiContainer: twr`-mb-12 flex h-72 w-full justify-start gap-2 gap-4 rounded-3xl bg-gray-300 p-6`,
	}

	return (
		<SafeAreaView>
			<StatusBar style="auto" />
			<View className={styles.body}>
				<Spacer />
				<View className={styles.logoContainer}>
					<Text className={styles.logo}>
						Deen
						<MotiView
							style={styles.motiLogo}
							from={{ opacity: 0, translateY: 200, scale: 0.5 }}
							animate={{ opacity: 1, translateY: 0, scale: 1 }}
							transition={{
								scale: { type: "spring", delay: 350 },
							}}
						>
							<Text className={styles.logoPrimary}>Up!</Text>
						</MotiView>
					</Text>
				</View>
				<Spacer />
				<MotiView
					from={{ opacity: 0, translateY: 250 }}
					animate={{ opacity: 1, translateY: 0 }}
					style={styles.motiContainer}
					transition={{
						type: "timing",
						delay: 200,
					}}
				>
					<View className={styles.playButtonsContainer}>
						<Button
							color="primary"
							size="xl"
							label="Join Game"
							onPress={() =>
								router.push(
									currentUser ? "/join-game" : "/auth/",
								)
							}
							buttonStyle={styles.joinGameButton}
						/>
						<Button
							color="primary"
							size="xl"
							label="Create Game"
							onPress={() =>
								router.push(
									currentUser ? "/create-game" : "/auth/",
								)
							}
							buttonStyle={styles.createGameButton}
						/>
					</View>
					<Button
						color="primary"
						size="xl"
						label="Solo Mode"
						onPress={() => {
							router.push("/solo-mode")
						}}
						buttonStyle="rounded-3xl"
					/>
					{/* <Button
						color="primary"
						size="xl"
						label="Friends Mode Result"
						onPress={() => {
							router.push("/friends-mode/result")
						}}
					/> */}
					<View className="flex flex-row items-center justify-between px-3">
						<Button
							color="primary"
							size="sm"
							onPress={() => {}}
							buttonStyle="rounded-full size-12"
							iconName="gamepad-circle-outline"
						/>
						<Button
							color="primary"
							size="xl"
							onPress={() => router.push("/profile")}
							buttonStyle="rounded-full size-12"
							iconName="face-man-profile"
						/>
					</View>
				</MotiView>
			</View>
		</SafeAreaView>
	)
}
