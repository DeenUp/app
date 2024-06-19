import { useEffect, useState } from "react"
import { View } from "react-native"
import { SheetManager } from "react-native-actions-sheet"

import type { GameStore } from "~/stores"

import { useGameStore } from "~/stores"
import { tw } from "~/utils"

import { CodeDigitBox } from "./CodeDigit"

const CodeComponent = () => {
	const { code } = useGameStore((state: GameStore) => ({
		code: state.lobbyCode,
	}))

	const [chars, setChars] = useState<string[] | undefined>([])

	const copyCodeToClipboard = () => {
		if (!code) return

		SheetManager.show("share-sheet")

		// ref.current?.present()
	}

	useEffect(() => {
		if (!code) return

		const codeDigits = code.split("")
		const setDigits = (digits: string[]) => {
			if (digits.length === 0) return

			codeDigits.forEach((digit, index) => {
				setTimeout(() => {
					setChars((prev) => {
						const newChars = [...(prev || [])]
						newChars[index] = digit

						return newChars
					})
				}, 100 * index)
			})
		}

		setDigits(codeDigits)
	}, [code])

	const styles = {
		codeTextContainer: tw`flex flex-row items-center justify-center pl-[18px]`,
	}

	return (
		<>
			<View className={styles.codeTextContainer}>
				{Array.from({ length: 6 }).map((_, index) => (
					<CodeDigitBox
						onPress={copyCodeToClipboard}
						key={index}
						digit={
							chars && chars.length > index
								? chars[index]
								: undefined
						}
					/>
				))}
			</View>
		</>
	)
}

export default CodeComponent
