import React, { useEffect, useState } from "react"
import { View } from "react-native"

import { MotiText } from "moti"
import twr from "twrnc"

import { tw } from "~/helpers"

type CodeComponentProps = {
	code?: string | null
}

const CodeComponent: React.FC<CodeComponentProps> = ({ code }) => {
	const [placeholders, setPlaceholders] = useState<number[]>([])
	const [displayedCode, setDisplayedCode] = useState<string[]>([])

	useEffect(() => {
		let intervalId: NodeJS.Timeout | undefined

		const generatePlaceholders = () => {
			return Array.from({ length: 6 }, () =>
				Math.floor(Math.random() * 10),
			)
		}

		if (!code) {
			intervalId = setInterval(() => {
				setPlaceholders(generatePlaceholders())
			}, 100)
		} else {
			if (intervalId) clearInterval(intervalId)
			const codeArray = code.split("")
			codeArray.forEach((digit, index) => {
				setTimeout(() => {
					setDisplayedCode((prev) => {
						const newCode = [...prev]
						newCode[index] = digit

						return newCode
					})
				}, index * 200)
			})
		}

		return () => {
			if (intervalId) clearInterval(intervalId)
		}
	}, [code])

	const styles = {
		codeText: twr`text-xl font-bold`,
		buttonContainer: tw`flex w-full flex-row items-center justify-center gap-6 `,
		codeTextContainer: tw`flex flex-row items-center justify-center`,
		codeDigitBox: tw`m-1 w-14 items-center justify-center rounded-md bg-gray-200 p-4`,
		createGameButton: tw`w-2/3`,
	}

	return (
		<View className={styles.codeTextContainer}>
			{placeholders.map((placeholder, index) => (
				<View key={index} className={styles.codeDigitBox}>
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
				</View>
			))}
		</View>
	)
}

export default CodeComponent
