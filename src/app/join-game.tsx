import type { TextInput } from "react-native"

import { useEffect, useRef, useState } from "react"
import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import * as Clipboard from "expo-clipboard"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"

import { FontAwesome6 } from "@expo/vector-icons"
import twr from "twrnc"

import type { GameStore } from "~/stores"

import { CodeInput } from "~/components/auth"
import {
	Button,
	ParticipantsList,
	Separator,
	ThemedAwesomeButton,
} from "~/components/ui"
import { useGameStore, useSettingsStore } from "~/stores"
import { tw } from "~/utils"

type States = {
	inputCode: string[]
}

export default function CreateGame() {
	const CODE_LENGTH = 6
	const { translate, theme } = useSettingsStore()

	const { gameSessionID, participants, joinLobby } = useGameStore(
		(state: GameStore) => ({
			checkIfUserInLobby: state.checkIfUserInLobby,
			participants: state.participants,
			error: state.error,
			destroy: state.destroy,
			leaveLobby: state.leaveLobby,
			joinLobby: state.joinLobby,
			joinExistingLobby: state.joinExistingLobby,
			gameSessionID: state.gameSessionID,
			gameRound: state.gameRound,
		}),
	)

	useEffect(() => {
		if (gameSessionID) {
			router.replace("/friends-mode/")
		}
	}, [gameSessionID])

	const [states, setStates] = useState<States>({
		inputCode: Array(CODE_LENGTH).fill("") as string[],
	})

	const inputRefs = useRef<(TextInput | null)[]>([])

	const handleCodeChange = (text: string, index: number) => {
		const newCode = [...states.inputCode]
		newCode[index] = text

		setStates((states) => ({
			...states,
			inputCode: newCode,
		}))

		if (text === "" && index > 0) {
			inputRefs.current[index - 1]?.focus()
		} else if (text !== "" && index < CODE_LENGTH - 1) {
			inputRefs.current[index + 1]?.focus()
		}

		if (text.length > 1) {
			const codeArray = text.split("")

			codeArray.forEach((value: string, index: number) => {
				if (index < CODE_LENGTH) {
					newCode[index] = value
				}
			})

			setStates((states) => ({
				...states,
				inputCode: newCode,
			}))
		}

		if (text.length === 0 && index > 0) {
			inputRefs.current[index - 1]?.focus()
		}
	}

	const handleContinue = async () => {
		const inputCode = states.inputCode

		if (inputCode.some((digit) => digit === "")) {
			alert(translate("joinGameAlert"))

			return
		}

		await joinLobby(inputCode.join(""))
	}

	const handlePasteFromClipboard = async () => {
		try {
			const text: string = await Clipboard.getStringAsync()

			const newCode: string[] = [...states.inputCode]
			const sourceText =
				text.length > CODE_LENGTH
					? text.substring(0, CODE_LENGTH)
					: text

			sourceText.split("").forEach((value, index) => {
				newCode[index] = value
			})

			setStates((states) => ({
				...states,
				inputCode: newCode,
			}))
		} catch (error) {
			console.error("Error pasting from clipboard:", error)
		}
	}

	const styles = {
		container: tw`flex justify-center bg-primary`,
		headerContainer: tw`mt-32 w-full flex-col items-start justify-start gap-6 p-4`,
		headerText: tw`text-4xl font-bold text-background`,
		codeContainer: tw`h-full items-center justify-start gap-8 rounded-t-[50] bg-background px-10 pt-12`,

		buttonContainer: tw`flex w-full flex-col items-center justify-center gap-6`,
		backButton: tw`flex h-16 items-center justify-center rounded-full p-4`,
		codeInputContainer: tw`flex flex-row items-center justify-center gap-2 pl-12`,
	}

	return (
		<SafeAreaView
			style={{
				backgroundColor: "#472836",
				flex: 1,
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
						onPress={() => router.dismissAll()}
						size="sm"
					/>
					<View className="flex w-full items-center justify-center">
						<Text className={styles.headerText}>
							{translate("joinGamePage.joinGameHeader")}
						</Text>
					</View>
				</View>
				<View className={styles.codeContainer}>
					<View className={styles.codeInputContainer}>
						<CodeInput
							code={states.inputCode}
							handleCodeChange={handleCodeChange}
							inputRefs={inputRefs}
							inputClass="w-[40] h-16 border-2 border-primary"
						/>
						<ThemedAwesomeButton
							theme="c137"
							type="anchor"
							width={55}
							borderRadius={10}
							onPress={handlePasteFromClipboard}
						>
							<FontAwesome6
								name="paste"
								size={24}
								color="#472836"
							/>
						</ThemedAwesomeButton>
					</View>
					{participants.length > 0 && <ParticipantsList />}
					<Separator color="primary" className="w-full" />
					{participants.length === 0 && (
						<View className={styles.buttonContainer}>
							<ThemedAwesomeButton
								onPress={handleContinue}
								type="anchor"
								size="large"
								textSize={20}
								width={360}
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
								{translate("joinGamePage.joinGameButton")}
							</ThemedAwesomeButton>
						</View>
					)}

					{/* {error && <Text>{error as string}</Text>} */}
				</View>
			</View>
		</SafeAreaView>
	)
}
