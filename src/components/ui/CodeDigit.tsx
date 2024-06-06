// import React, { useEffect, useMemo, useState } from "react"

import { MotiText } from "moti"
import twr from "twrnc"

import { useSettingsStore } from "~/stores"

import ThemedAwesomeButton from "./AwesomeButton"

type CodeComponentProps = {
	digit?: string | null
	onPress?: () => void
}

export const CodeDigitBox: React.FC<CodeComponentProps> = ({
	digit,
	onPress,
}) => {
	// const [placeHolder, setPlaceHolder] = useState<string>("")
	const { theme } = useSettingsStore()

	// const characters = useMemo(
	// 	() => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
	// 	[],
	// )

	// const generatePlaceholder = () =>
	// 	characters.charAt(Math.floor(Math.random() * characters.length))

	const styles = {
		codeText: twr`text-xl font-bold`,
	}

	return (
		<ThemedAwesomeButton
			theme="bruce"
			width={56}
			borderColor={theme.primary}
			backgroundColor={theme.background}
			paddingBottom={2}
			raiseLevel={digit ? 4 : 0}
			style={twr`mx-1`}
			onPress={onPress}
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
					delay: 1000,
				}}
				style={styles.codeText}
			>
				{digit}
			</MotiText>
		</ThemedAwesomeButton>
	)
}
