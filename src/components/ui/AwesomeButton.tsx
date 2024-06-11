import type { FC } from "react"
import type { ButtonTypes } from "react-native-really-awesome-button/lib/typescript/src/Button"

import { ThemedButton } from "react-native-really-awesome-button"

import * as Haptics from "expo-haptics"

import { MaterialCommunityIcons } from "@expo/vector-icons"

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
			onPress={() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
				onPress()
			}}
			raiseLevel={5}
		>
			<MaterialCommunityIcons name="close" color={"white"} size={18} />
		</ThemedAwesomeButton>
	)
}

const AddButton: FC<ButtonProps> = ({ onPress }) => {
	return (
		<ThemedAwesomeButton
			theme="bruce"
			type="secondary"
			width={50}
			height={50}
			paddingTop={4}
			paddingHorizontal={4}
			onPress={() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
				onPress()
			}}
			raiseLevel={2}
			backgroundColor="#F9F2DF"
		>
			<MaterialCommunityIcons name="plus" color="#472836" size={18} />
		</ThemedAwesomeButton>
	)
}

const CopyButton: FC<ButtonProps> = ({ onPress }) => {
	return (
		<ThemedAwesomeButton
			theme="bruce"
			type="secondary"
			width={60}
			height={60}
			paddingTop={4}
			paddingHorizontal={4}
			onPress={() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
				onPress()
			}}
			raiseLevel={2}
			backgroundColor="#F9F2DF"
		>
			<MaterialCommunityIcons
				name="content-copy"
				color="#472836"
				size={18}
			/>
		</ThemedAwesomeButton>
	)
}

type ShareButtonProps = {
	icon: keyof typeof MaterialCommunityIcons.glyphMap
}

const ShareButton: FC<
	ThemedButton & ButtonTypes & ButtonProps & ShareButtonProps
> = ({ type, onPress, icon }) => {
	return (
		<ThemedAwesomeButton
			theme="bruce"
			type={type}
			width={60}
			height={60}
			paddingTop={4}
			paddingHorizontal={4}
			onPress={() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
				onPress()
			}}
			raiseLevel={4}
		>
			<MaterialCommunityIcons
				name={
					icon in MaterialCommunityIcons.glyphMap
						? icon
						: "share-variant"
				}
				color="white"
				size={30}
			/>
		</ThemedAwesomeButton>
	)
}

export { AddButton, CloseButton, CopyButton, ShareButton }

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
