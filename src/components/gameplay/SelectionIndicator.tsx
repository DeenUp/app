import React from "react"
import { useAnimatedStyle, withSpring } from "react-native-reanimated"

import { LinearGradient } from "expo-linear-gradient"

import { MotiView } from "moti"
import twr from "twrnc"

import { useSettingsStore } from "~/stores"

type Props = {
	optionHeight: number
	selectedIndex: number | undefined
}
const SelectionIndicator = ({ optionHeight, selectedIndex }: Props) => {
	const { theme } = useSettingsStore()

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: withSpring(selectedIndex! * optionHeight),
				},
			],
		}
	})

	return (
		<MotiView
			exit={{
				opacity: 0,
				translateY: -100,
			}}
			style={[
				twr`absolute left-0 right-0 top-0 -z-10 rounded border bg-transparent h-[${optionHeight}px] w-full border-[${theme.primary}] rounded-xl `,
				animatedStyle,
			]}
		>
			<LinearGradient
				style={twr`absolute h-full w-full rounded-xl`}
				colors={[theme.background, theme.surface]}
				end={[1, 1]}
				start={[0, 0]}
				locations={[0.1, 1]}
			/>
		</MotiView>
	)
}

export default SelectionIndicator
