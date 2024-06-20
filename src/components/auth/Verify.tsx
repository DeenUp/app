import type { TextInput } from "react-native"

import { useEffect, useRef, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"

import * as Clipboard from "expo-clipboard"

import { FontAwesome6, Ionicons } from "@expo/vector-icons"
import CodeInput from "~components/auth/CodeInput"

import { useAuthStore, useGameStore, useSettingsStore } from "~/stores"
import { tw } from "~/utils"

import { ThemedAwesomeButton } from "../ui"

type States = {
	inputCode: string[]
}

const Verify = () => {
	const CODE_LENGTH = 6
	const translate = useSettingsStore((state) => state.translate)
	const { setConfirmationCode, error } = useAuthStore()
	const { seconds, setTime, countdown } = useGameStore()

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

		setConfirmationCode(newCode.join(""))
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

			setConfirmationCode(newCode.join(""))
		} catch (error) {
			console.error("Error pasting from clipboard:", error)
		}
	}

	useEffect(() => {
		setTime(0, 60)
		countdown()
	}, [])

	const styles = {
		signUpText: tw` font-bold text-primary`,
		errorText: tw`text-red-500`,
	}

	return (
		<View className="w-full flex-col items-center justify-center gap-6">
			<View className="flex-row gap-2">
				<CodeInput
					code={states.inputCode}
					handleCodeChange={handleCodeChange}
					inputRefs={inputRefs}
					inputClass="w-12 h-14 border-primary text-xl font-bold border-2"
				/>
				<ThemedAwesomeButton
					theme="c137"
					type="anchor"
					width={55}
					borderRadius={10}
					onPress={handlePasteFromClipboard}
				>
					<FontAwesome6 name="paste" size={24} color="#472836" />
				</ThemedAwesomeButton>
			</View>
			{error && <Text className={styles.errorText}>{error}</Text>}
			<Text className="w-full text-center text-xl font-bold text-primary">
				{translate("authPage.verify.noCodeRecieved")}
			</Text>
			<View className="flex flex-row items-center justify-center p-2">
				<Text className={styles.signUpText}>
					{translate("authPage.verify.resendCode")}
					<TouchableOpacity className="">
						{seconds === 0 ? (
							<Ionicons name="reload" size={24} color="black" />
						) : (
							<Text>{seconds}</Text>
						)}
					</TouchableOpacity>
				</Text>
			</View>
		</View>
	)
}

export default Verify
