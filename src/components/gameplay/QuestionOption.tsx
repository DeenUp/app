import type { ReactNode } from "react"

import { Text, View } from "react-native"

import AntIcons from "@expo/vector-icons/AntDesign"
import { MotiView } from "moti"
import twr from "twrnc"

import { tw } from "~/helpers"

import { ThemedAwesomeButton } from "../ui"

const QuestionOption = ({
	index,
	label,
	isSelected,
	showResult,
	isCorrect,
	onPress,
}: {
	index: number
	label: string
	isSelected: boolean
	showResult: boolean
	isCorrect?: boolean
	onPress?: ((callback?: () => void) => void) | undefined
}): ReactNode => {
	const styles = {
		card: twr`w-full  flex-row items-center justify-start gap-4 rounded-xl px-4 py-3 `,
		answer: tw`w-2/3 text-lg font-bold`,
		icon: tw`absolute right-3 items-center justify-center rounded-full ${isCorrect ? "border-green-500" : "border-red-500"}`,
	}

	return (
		<MotiView
			style={styles.card}
			from={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ type: "timing", delay: index * 600, duration: 200 }}
			exit={{ opacity: 0 }}
		>
			<ThemedAwesomeButton
				theme="summer"
				type="secondary"
				width={50}
				height={50}
				borderRadius={100}
				onPress={onPress}
			>
				<Text className={tw`text-xl font-semibold text-gray-500`}>
					{index === 1
						? "A"
						: index === 2
							? "B"
							: index === 3
								? "C"
								: index === 4
									? "D"
									: ""}
				</Text>
			</ThemedAwesomeButton>
			<Text className={styles.answer}>{label}</Text>
			{isSelected && showResult && (
				<View className={styles.icon}>
					<AntIcons
						name={isCorrect ? "checkcircle" : "closecircle"}
						size={28}
						color={isCorrect ? "#00D30A" : "#FF0200"}
					/>
				</View>
			)}
		</MotiView>
	)
}

export default QuestionOption
