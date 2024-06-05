import type { ReactNode } from "react"

import { Text, View } from "react-native"

import { SegmentedProgressBar, Timer } from "~/components/ui"
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
		base: tw`w-full flex-col items-center  justify-center gap-4`,
		row: tw`mb-2 w-full flex-row items-center justify-center`,
		text: tw`text-center text-4xl font-bold text-white`,
		progressBar: tw`rounded-5 bg-surface`,
	}

	return (
		<View className={styles.base}>
			<View className={styles.row}>
				<Text className={styles.text}>Question {index}</Text>
				{timed && <Timer minute={minutes!} second={seconds!} />}
			</View>

			<SegmentedProgressBar
				progress={index / length!}
				segments={length!}
				color="#947962"
				backgroundColor="#F3E3BA"
			/>
		</View>
	)
}

export default QuestionHeader
