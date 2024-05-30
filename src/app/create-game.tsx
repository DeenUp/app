import type { ReactNode } from "react"

import { useEffect } from "react"
import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

// import * as Clipboard from "expo-clipboard"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"

import { FontAwesome6 } from "@expo/vector-icons"
import twr from "twrnc"

import type { GameStore } from "~/stores"

import { Button, CodeComponent, ThemedAwesomeButton } from "~/components/ui"
import ParticipantsList from "~/components/ui/ParticipantsList"
import { tw } from "~/helpers"
import { useGameStore, useSettingsStore } from "~/stores"

export default function CreateGame(): ReactNode {
	const translate = useSettingsStore((state) => state.translate)

	const {
		gameSessionID,
		participants,
		destroy,
		createLobby,
		leaveLobby,
		startGame,
		code,
		error,
	} = useGameStore((state: GameStore) => ({
		gameSessionID: state.gameSessionID,
		participants: state.participants,
		code: state.lobbyCode,
		error: state.error,
		destroy: state.destroy,
		createLobby: state.createLobby,
		startGame: state.startGame,
		leaveLobby: state.leaveLobby,
	}))

	useEffect(() => {
		void createLobby()

		return () => {
			destroy()
		}
	}, [])

	useEffect(() => {
		if (gameSessionID) {
			router.navigate("/friends-mode/")
		}
	}, [gameSessionID])

	const handleExit = async () => {
		await leaveLobby()
		router.dismiss()
	}

	// const handleShare = async () => {
	// 	if (!code) return

	// 	await Clipboard.setStringAsync(code)
	// }

	const styles = {
		container: tw`flex justify-center bg-primary`,
		headerContainer: tw`mt-32 w-full flex-col items-start justify-start gap-6 p-4`,
		headerText: tw`text-4xl font-bold text-base-100`,
		subheaderText: tw`text-base-200`,
		codeContainer: tw`h-full items-center justify-start gap-8 rounded-t-[50] bg-base-100 px-10 pt-12`,
		codeText: twr`text-xl font-bold`,
		buttonContainer: tw`flex w-full flex-row items-center justify-center gap-6 `,
		backButton: tw``,
		copyButton: tw`m-1 flex h-14 w-10 items-center rounded-md border border-gray-300 bg-primary px-2`,
		codeTextContainer: tw`flex flex-row items-center justify-center`,
		codeDigitBox: tw`m-1 rounded-md bg-gray-200 p-4`,
		createGameButton: tw`w-2/3`,
	}

	return (
		<SafeAreaView
			style={{
				backgroundColor: "#472836",
			}}
		>
			<StatusBar style="light" />
			<View className={styles.container}>
				<View className={styles.headerContainer}>
					<Button
						iconName="chevron-left"
						iconSize={32}
						iconColor="white"
						color="link"
						buttonStyle={styles.backButton}
						onPress={handleExit}
						size="sm"
					/>
					<View className="flex w-full items-center justify-center">
						<Text className={styles.headerText}>
							{translate("createGamePage.header")}
						</Text>
					</View>
				</View>
				<View className={styles.codeContainer}>
					<Text className="text-lg text-primary">
						Tell your friends to enter this code to join
					</Text>
					<View className={styles.codeTextContainer}>
						<CodeComponent code={code} />
					</View>

					{error && <Text>{error}</Text>}
					{participants.length > 0 && <ParticipantsList />}
					<View className={tw`h-1 w-full bg-primary`} />
					<View className={styles.buttonContainer}>
						<ThemedAwesomeButton
							onPress={startGame}
							type="anchor"
							size="large"
							textSize={20}
							width={370}
							raiseLevel={8}
							after={
								<FontAwesome6
									name="play"
									size={20}
									color="#472836"
									style={twr`ml-3`}
								/>
							}
						>
							{translate("createGamePage.button")}
						</ThemedAwesomeButton>
					</View>
				</View>
			</View>
		</SafeAreaView>
	)
}
