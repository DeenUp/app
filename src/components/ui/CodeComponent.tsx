import React, { useEffect, useState } from "react"
import { View } from "react-native"

import * as Clipboard from "expo-clipboard"

import { MotiText } from "moti"
import twr from "twrnc"

import { tw } from "~/helpers"

import ThemedAwesomeButton from "./AwesomeButton"

type States = {
	placeholders: number[]
	displayedCode: string[]
	raiseLevels: number[]
}

type CodeComponentProps = {
	code?: string | null
}

const CodeComponent: React.FC<CodeComponentProps> = ({ code }) => {
	const [states, setStates] = useState<States>({
		placeholders: [],
		displayedCode: [],
		raiseLevels: [],
	})

	const { placeholders, displayedCode, raiseLevels } = states

	useEffect(() => {
		const intervalId = setInterval(() => {
			setStates((prev) => {
				const newPlaceholders = Array.from({ length: 6 }, () =>
					Math.floor(Math.random() * 10),
				)

				return {
					...prev,
					placeholders: newPlaceholders,
				}
			})
		}, 100)

		return () => {
			clearInterval(intervalId)
		}
	}, [])

	useEffect(() => {
		if (code) {
			const codeArray = code.split("")

			setStates((prev) => {
				const newDisplayedCode = Array(codeArray.length).fill("")
				const newRaiseLevels = Array(codeArray.length).fill(1)

				return {
					...prev,
					displayedCode: newDisplayedCode,
					raiseLevels: newRaiseLevels,
				}
			})

			codeArray.forEach((digit, index) => {
				setTimeout(() => {
					setStates((prev) => {
						const newDisplayedCode = [...prev.displayedCode]
						const newRaiseLevels = [...prev.raiseLevels]

						newDisplayedCode[index] = digit
						newRaiseLevels[index] = 6

						return {
							...prev,
							displayedCode: newDisplayedCode,
							raiseLevels: newRaiseLevels,
						}
					})
				}, index * 200)
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
			{placeholders.map((placeholder, index) => (
				<ThemedAwesomeButton
					key={index}
					theme="bruce"
					width={56}
					borderColor="#472836"
					backgroundColor="#F9F2DF"
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
						}}
						style={styles.codeText}
					>
						{displayedCode[index] !== undefined
							? (displayedCode[index] as string)
							: placeholder}
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
