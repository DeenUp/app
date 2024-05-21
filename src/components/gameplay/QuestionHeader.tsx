import type { ReactNode } from "react"

import { Text, View } from "react-native"
import { ProgressBar } from "react-native-paper"

import { Timer } from "~/components/ui"
import { tw } from "~/helpers"

const QuestionHeader = ({
	index,
	length,
	minutes,
	seconds,
	timed,
}: {
	index: number
	length?: number
	minutes?: number
	seconds?: number
	timed: boolean
}): ReactNode => {
	const styles = {
		base: tw`flex-col items-stretch px-10 py-12`,
		row: tw`mb-2 w-full flex-row items-center justify-between`,
		text: tw`text-center text-4xl font-bold text-white`,
		progressBar: tw`rounded-5 bg-surface`,
	}

	return (
		<View className={styles.base}>
			<View className={styles.row}>
				<Text className={styles.text}>Question {index}</Text>
				{timed && <Timer minute={minutes!} second={seconds!} />}
			</View>
			<ProgressBar
				color="#03dac6"
				progress={index / length!}
				className={styles.progressBar}
			/>
		</View>
	)
}

export default QuestionHeader
