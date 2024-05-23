import type { ReactNode } from "react"

import { useEffect, useState } from "react"
import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import * as Clipboard from "expo-clipboard"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"

import { AnimatePresence, MotiText, MotiView } from "moti"
import twr from "twrnc"

import type { GameStore } from "~/stores"

import { Button, CodeComponent } from "~/components/ui"
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

	const handleShare = async () => {
		if (!code) return

		await Clipboard.setStringAsync(code)
	}

	const styles = {
		container: tw`flex justify-center bg-primary`,
		headerContainer: tw`absolute left-10 top-4 flex w-2/3 flex-row gap-6`,
		headerText: tw`text-3xl font-bold text-white`,
		subheaderText: tw`text-base-200`,
		codeContainer: tw`mt-72 flex h-full items-center justify-start gap-8  rounded-lg rounded-t-3xl bg-gray-100 pt-20`,
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
				backgroundColor: "#6D28D9",
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
					<View>
						<Text className={styles.headerText}>
							{translate("createGamePage.header")}
						</Text>
						<Text className={styles.subheaderText}>
							{translate("createGamePage.subheader")}
						</Text>
					</View>
				</View>
				<View className={styles.codeContainer}>
					<View className={styles.codeTextContainer}>
						<CodeComponent code={code} />
					</View>
					<View className={styles.buttonContainer}>
						<Button
							onPress={startGame}
							buttonStyle={styles.createGameButton}
							size="lg"
							color="primary"
							label={translate("createGamePage.button")}
						/>
					</View>
					{/* {error && <Text>{error}</Text>} */}
					{participants.length > 0 && <ParticipantsList />}
				</View>
			</View>
		</SafeAreaView>
	)
}
