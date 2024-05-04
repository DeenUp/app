import type { ReactNode } from "react"
import type { GestureResponderEvent } from "react-native"

import { Text, TouchableOpacity, View } from "react-native"

import AntIcons from "@expo/vector-icons/AntDesign"

import { tw } from "~/helpers"

const QuestionOption = ({
	label,
	isSelected,
	showResult,
	isCorrect,
	onPress,
}: {
	label: string
	isSelected: boolean
	showResult: boolean
	isCorrect?: boolean
	onPress?: ((event: GestureResponderEvent) => void) | undefined
}): ReactNode => {
	const borderStyle =
		isSelected && showResult
			? `border-${isCorrect ? "green" : "red"}-500`
			: ""

	const styles = {
		card: tw`flex flex-row items-center justify-between rounded-xl bg-gray-100 px-4 py-6 ${isSelected ? "border" : ""} ${borderStyle}`,
		text: tw`text-xl font-semibold text-gray-500`,
		circle: tw`items-center justify-center rounded-full ${isCorrect ? "border-green-500" : "border-red-500"}`,
	}

	return (
		<TouchableOpacity className={styles.card} onPress={onPress}>
			<Text className={styles.text}>{label}</Text>
			{isSelected && showResult && (
				<View className={styles.circle}>
					<AntIcons
						name={isCorrect ? "checkcircle" : "closecircle"}
						size={28}
						color={isCorrect ? "#00D30A" : "#FF0200"}
					/>
				</View>
			)}
		</TouchableOpacity>
	)
}

export default QuestionOption
