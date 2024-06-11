import { forwardRef, useEffect, useState } from "react"
import { View } from "react-native"

import type { GameStore } from "~/stores"

import { tw } from "~/helpers"
import { useGameStore } from "~/stores"

import { CodeDigitBox } from "./CodeDigit"

const CodeComponent = forwardRef((props: any, ref: any) => {
	const { code } = useGameStore((state: GameStore) => ({
		code: state.lobbyCode,
	}))

	const [chars, setChars] = useState<string[] | undefined>([] as string[])

	const copyCodeToClipboard = () => {
		if (!code) return

		ref.current?.present()
	}

	useEffect(() => {
		if (!code) return

		const codeDigits = code.split("")
		const setDigits = (digits: string[]) => {
			if (digits.length === 0) return
			const [char, ...rest] = digits
			setChars((prev) => [...prev, char])

			setTimeout(() => setDigits(rest), 100)
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
						digit={code ? chars[index] : null}
					/>
				))}
			</View>
		</>
	)
})

export default CodeComponent
