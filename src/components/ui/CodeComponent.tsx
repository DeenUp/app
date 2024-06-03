import React, { useEffect, useState } from "react"
import { View } from "react-native"

import * as Clipboard from "expo-clipboard"

import { MotiText } from "moti"
import twr from "twrnc"

import { tw } from "~/helpers"
import { useSettingsStore } from "~/stores"

import ThemedAwesomeButton from "./AwesomeButton"

type CodeComponentProps = {
	code?: string | null
}

const CodeComponent: React.FC<CodeComponentProps> = ({ code }) => {
	const [placeholders, setPlaceholders] = useState<string[]>(
		Array(6).fill(""),
	)
	const [displayedCode, setDisplayedCode] = useState<string[]>([])
	const [raiseLevels, setRaiseLevels] = useState<number[]>(Array(6).fill(0))

	const { theme } = useSettingsStore()

	const generatePlaceholders = () => {
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

		return Array.from({ length: 6 }, () =>
			characters.charAt(Math.floor(Math.random() * characters.length)),
		)
	}

	useEffect(() => {
		const intervalId = setInterval(() => {
			setPlaceholders(generatePlaceholders())
		}, 60)

		return () => {
			clearInterval(intervalId)
		}
	}, [])

	useEffect(() => {
		if (code) {
			const codeArray = code.split("")

			codeArray.forEach((digit, index) => {
				setTimeout(() => {
					setDisplayedCode((prev) => {
						const newDisplayedCode = [...prev]
						newDisplayedCode[index] = digit

						return newDisplayedCode
					})

					setRaiseLevels((prev) => {
						const newRaiseLevels = [...prev]
						newRaiseLevels[index] = 6

						return newRaiseLevels
					})
				}, index * 800)
			})
		}
	}, [code])

	const styles = {
		codeText: twr`text-xl font-bold`,
		buttonContainer: tw`flex w-full flex-row items-center justify-center gap-12 `,
		codeTextContainer: tw`flex flex-row items-center justify-center`,
		codeDigitBox: tw`m-1 h-16 w-14 items-center justify-center rounded-xl border-2 border-primary p-4`,
		createGameButton: tw`w-2/3`,
	}

	return (
		<View className={styles.codeTextContainer}>
			{Array.from({ length: 6 }).map((_, index) => (
				<ThemedAwesomeButton
					key={index}
					theme="bruce"
					width={56}
					borderColor={theme.primary}
					backgroundColor={theme.background}
					paddingBottom={2}
					raiseLevel={raiseLevels[index] || 1}
					onPress={() => {
						Clipboard.setStringAsync(displayedCode.join(""))
					}}
					style={twr`mx-1`}
				>
					<MotiText
						from={{
							opacity: 0,
							translateY: 20,
						}}
						animate={{
							opacity: 1,
							translateY: 0,
						}}
						transition={{
							type: "timing",
							duration: 100,
							delay: index * 100,
							repeat: 1,
						}}
						style={styles.codeText}
					>
						{displayedCode[index] !== undefined
							? (displayedCode[index] as string)
							: placeholders[index]}
					</MotiText>
				</ThemedAwesomeButton>
			))}

			{/* <ThemedAwesomeButton theme="bruce" type="secondary" width={56}>
				<MaterialIcons
					style={twr`font-extrabold `}
					name="ios-share"
					size={24}
					color="black"
				/>
			</ThemedAwesomeButton> */}
		</View>
	)
}

export default CodeComponent
