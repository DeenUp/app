import type { ReactNode } from "react"

import { useEffect } from "react"
import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"

import { FontAwesome6 } from "@expo/vector-icons"
import { MotiText } from "moti"
import twr from "twrnc"

import type { GameStore } from "~/stores"

import {
	Button,
	CodeComponent,
	Separator,
	ThemedAwesomeButton,
} from "~/components/ui"
import ParticipantsList from "~/components/ui/ParticipantsList"
import { tw } from "~/helpers"
import { useGameStore, useSettingsStore } from "~/stores"

export default function CreateGame(): ReactNode {
	const { translate, theme } = useSettingsStore()

	const {
		gameSessionID,
		participants,
		createLobby,
		leaveLobby,
		startGame,
		error,
	} = useGameStore((state: GameStore) => ({
		gameSessionID: state.gameSessionID,
		participants: state.participants,
		error: state.error,
		destroy: state.destroy,
		createLobby: state.createLobby,
		startGame: state.startGame,
		leaveLobby: state.leaveLobby,
	}))

	useEffect(() => {
		void createLobby()
	}, [])

	useEffect(() => {
		if (gameSessionID) {
			router.replace("/friends-mode/")
		}
	}, [gameSessionID])

	const handleExit = async () => {
		await leaveLobby()
		router.dismiss()
	}

	const styles = {
		container: tw`flex justify-center bg-primary`,
		headerContainer: tw`mt-32 w-full flex-col items-start justify-start gap-6 p-4`,
		headerText: tw`text-4xl font-bold text-background`,
		codeContainer: tw`h-full items-center justify-start gap-8 rounded-t-[50] bg-background px-10 pt-12`,
		buttonContainer: tw`flex w-full flex-row items-center justify-center gap-6 `,
		codeTextContainer: tw`flex flex-row items-center justify-center`,
	}

	return (
		<SafeAreaView
			style={{
				backgroundColor: theme.primary,
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
						<CodeComponent />
					</View>

					{error && (
						<MotiText
							style={twr`text-center text-xl text-red-500`}
							from={{ scale: 0, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ type: "spring", duration: 500 }}
						>
							{error}
						</MotiText>
					)}
					{participants.length > 0 && <ParticipantsList />}
					<Separator color="primary" className="w-full" />
					<View className={styles.buttonContainer}>
						<ThemedAwesomeButton
							progress
							onPress={(next) => {
								startGame()
								//@ts-ignore
								next()
							}}
							type="anchor"
							size="large"
							textSize={20}
							width={370}
							raiseLevel={8}
							after={
								<FontAwesome6
									name="play"
									size={20}
									color={theme.primary}
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
