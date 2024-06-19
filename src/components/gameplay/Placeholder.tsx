import { Text, View } from "react-native"
import { Avatar } from "react-native-paper"

import { MotiView } from "moti"
import twr from "twrnc"

import type { GameStore, SettingsStore } from "~/stores"

import { useGameStore, useSettingsStore } from "~/stores"
import { tw } from "~/utils"

export default function Placeholder({ solo }: { solo: boolean }) {
	const theme = useSettingsStore((state: SettingsStore) => state.theme)

	const {
		gameRound,
		submittedAnswers,
		participants,
		selectedAnswer,
		questions,
		currentQuestionIndex,
	} = useGameStore((state: GameStore) => ({
		gameRound: state.gameRound,
		error: state.error,
		initializeGameRound: state.initializeGameRound,
		submittedAnswers: state.submittedAnswers,
		participants: state.participants,
		selectedAnswer: state.selectedAnswer,
		questions: state.questions,
		currentQuestionIndex: state.currentQuestionIndex,
	}))

	const styles = {
		options: tw`gap-6`,
		question: tw`text-center text-2xl font-bold`,
		card: twr`flex h-96 w-full flex-grow flex-col items-stretch justify-around rounded-3xl border-4 border-black bg-[${theme.background}] p-8 shadow-md`,
	}

	return (
		<MotiView
			style={styles.card}
			from={{
				opacity: 0,
				scale: 0.5,
			}}
			animate={{
				opacity: 1,
				scale: 1,
			}}
			transition={{
				type: "timing",
				duration: 500,
			}}
			exit={{
				opacity: 0,
				scale: 0.5,
			}}
			exitTransition={{
				type: "timing",
				duration: 500,
			}}
		>
			{!solo ? (
				<View>
					<Text className="text-center text-2xl">
						Waiting for other players to submit their answers
					</Text>
					<View className="flex flex-row items-center justify-center gap-2">
						{participants.map((participant) => (
							<Avatar.Icon
								key={participant.id}
								size={40}
								icon="account"
								style={{
									backgroundColor: submittedAnswers[
										gameRound!.id
									]!.find(
										(answer) =>
											answer.userID ===
												participant.userId &&
											answer.gameRoundID ===
												gameRound?.id,
									)
										? theme.accent
										: theme.surface,
								}}
							/>
						))}
					</View>
				</View>
			) : (
				<View className="">
					<Text className={styles.question}>
						{questions[currentQuestionIndex]?.question}
					</Text>
					<Text
						className="mb-4 text-center text-2xl font-bold text-[#472836]"
						style={{
							color:
								selectedAnswer ===
								questions[currentQuestionIndex]?.correctAnswer
									? "green"
									: "red",
						}}
					>
						{questions[currentQuestionIndex]?.correctAnswer}
					</Text>
				</View>
			)}
		</MotiView>
	)
}
