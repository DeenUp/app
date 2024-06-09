import { forwardRef } from "react"
import { View } from "react-native"

import * as Clipboard from "expo-clipboard"

import type { GameStore } from "~/stores"

import { tw } from "~/helpers"
import { useGameStore } from "~/stores"

import { CodeDigitBox } from "./CodeDigit"

const CodeComponent = forwardRef((props: any, ref: any) => {
	const { code } = useGameStore((state: GameStore) => ({
		code: state.lobbyCode,
	}))

	const copyCodeToClipboard = () => {
		if (!code) return

		Clipboard.setStringAsync(code)
		ref.current?.present()
	}

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
						digit={code ? code[index] : null}
					/>
				))}
			</View>
		</>
	)
})

export default CodeComponent
