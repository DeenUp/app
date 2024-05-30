import type { FC } from "react"
import type { ButtonTypes } from "react-native-really-awesome-button/lib/typescript/src/Button"

import { ThemedButton } from "react-native-really-awesome-button"

import { MaterialCommunityIcons } from "@expo/vector-icons"

export { CloseButton }

function ThemedAwesomeButton({
	theme,
	type,
	...extra
}: ThemedButton & ButtonTypes) {
	return (
		<ThemedButton name={theme ? theme : "c137"} type={type} {...extra}>
			{extra.children}
		</ThemedButton>
	)
}

type ButtonProps = {
	onPress: () => void
}

const CloseButton: FC<ButtonProps> = ({ onPress }) => {
	return (
		<ThemedAwesomeButton
			theme="mysterion"
			type="danger"
			width={30}
			height={30}
			paddingTop={4}
			paddingHorizontal={4}
			onPress={onPress}
			raiseLevel={5}
		>
			<MaterialCommunityIcons name="close" color={"white"} size={18} />
		</ThemedAwesomeButton>
	)
}
export type ThemedButton = {
	disabled?: boolean
	index?: number | null
	flat?: boolean
	config?: any
	theme?:
		| "basic"
		| "c137"
		| "bojack"
		| "bruce"
		| "cartman"
		| "mysterion"
		| "rick"
		| "summer"
		| null
	transparent?: boolean
	type?:
		| "primary"
		| "secondary"
		| "anchor"
		| "danger"
		| "flat"
		| "twitter"
		| "facebook"
		| "whatsapp"
		| "instagram"
		| "youtube"
		| "linkedin"
		| "pinterest"
		| "messenger"
	size?: "small" | "medium" | "large" | "icon"
	children?: any
	textSize?: number
}

export default ThemedAwesomeButton
