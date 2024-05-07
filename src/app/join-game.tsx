import type { TextInput } from "react-native"

import { useEffect, useRef, useState } from "react"
import { Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import * as Clipboard from "expo-clipboard"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"

import type { GameStore } from "~/stores"

import { CodeInput } from "~/components/auth"
import { Button, ParticipantsList } from "~/components/ui"
import { tw } from "~/helpers"
import { useGameStore, useSettingsStore } from "~/stores"

type States = {
	inputCode: string[]
}

export default function CreateGame() {
	const CODE_LENGTH = 8
	const translate = useSettingsStore((state) => state.translate)

	const { participants, error, leaveLobby, joinLobby, destroy } =
		useGameStore((state: GameStore) => ({
			participants: state.participants,
			error: state.error,
			destroy: state.destroy,
			leaveLobby: state.leaveLobby,
			joinLobby: state.joinLobby,
		}))

	useEffect(() => {
		return () => {
			destroy()
		}
	})

	const [states, setStates] = useState<States>({
		inputCode: Array(CODE_LENGTH).fill("") as string[],
	})

	const inputRefs = useRef<(TextInput | null)[]>([])

	const handleExit = async () => {
		await leaveLobby()
		router.dismiss()
	}

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
		headerContainer: tw`absolute left-10 top-4 flex w-2/3 flex-row gap-6`,
		headerText: tw`text-3xl font-bold text-white`,
		subheaderText: tw`text-base-200`,
		codeContainer: tw`mt-72 flex h-full items-center justify-start gap-8  rounded-lg rounded-t-3xl bg-gray-100 bg-white pt-20`,
		codeText: tw`text-xl font-bold`,
		buttonContainer: tw`flex w-full flex-col items-center justify-center gap-6`,
		backButton: tw`flex h-16 items-center justify-center rounded-full p-4`,
		shareButton: tw`flex items-center justify-center rounded-full border border-primary bg-base-100 p-4`,
		codeInputContainer: tw`flex flex-row items-center justify-center gap-2`,
		codeDigitBox: tw`m-1 rounded-md bg-gray-200 p-4`,
		joinGameButton: tw`w-2/3`,
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
							{translate("joinGamePage.joinGameHeader")}
						</Text>
						<Text className={styles.subheaderText}>
							{translate("joinGamePage.joinGameSubheader")}
						</Text>
					</View>
				</View>
				<View className={styles.codeContainer}>
					<View className={styles.codeInputContainer}>
						<CodeInput
							code={states.inputCode}
							handleCodeChange={handleCodeChange}
							inputRefs={inputRefs}
							inputClass="w-11 h-16"
						/>
					</View>
					<View className={styles.buttonContainer}>
						<Button
							color="base"
							size="sm"
							label={translate("joinGamePage.pasteFromClipboard")}
							onPress={handlePasteFromClipboard}
						/>
						<Button
							color="primary"
							size="lg"
							label={translate("joinGamePage.joinGameButton")}
							onPress={handleContinue}
							buttonStyle={styles.joinGameButton}
						/>
					</View>
					{error && <Text>{error}</Text>}
					{participants.length > 0 && (
						<ParticipantsList
							users={participants.map(
								(participant) => participant.user,
							)}
						/>
					)}
				</View>
			</View>
		</SafeAreaView>
	)
}
