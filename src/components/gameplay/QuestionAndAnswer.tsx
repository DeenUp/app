import { Text, View } from "react-native"
import { Avatar } from "react-native-paper"

import { MotiView } from "moti"
import twr from "twrnc"

import type { GameStore, SettingsStore } from "~/stores"

import { InputField } from "~/components/ui"
import { tw } from "~/helpers"
import { useGameStore, useSettingsStore } from "~/stores"

import QuestionOption from "./QuestionOption"

export default function QuestionAndAnswer() {
	const theme = useSettingsStore((state: SettingsStore) => state.theme)
	const {
		questions,
		currentQuestionIndex,
		waitingForPlayers,
		hasSubmitted,
		userAnswer,
		setUserAnswer,
		error,
		possibleAnswers,
		selectedAnswer,
		hasSelectedAnswer,
		selectPossibleAnswer,
	} = useGameStore((state: GameStore) => ({
		questions: state.questions,
		currentQuestionIndex: state.currentSessionQuestionIndex,
		waitingForPlayers: state.waitingForPlayers,
		hasSubmitted: state.hasSubmittedAnswer,
		userAnswer: state.userAnswer,
		setUserAnswer: state.setUserAnswer.bind(state),
		error: state.error,
		possibleAnswers: state.possibleAnswers,
		selectedAnswer: state.selectedAnswer,
		hasSelectedAnswer: state.hasSelectedAnswer,
		selectPossibleAnswer: state.selectPossibleAnswer.bind(state),
	}))

	const styles = {
		container: twr`flex h-[70%] w-[95%] flex-col items-center justify-center gap-6 rounded-xl bg-white p-4`,
		options: tw`gap-6`,
		question: tw`text-center text-2xl font-bold`,
		card: twr`h-full w-full flex-1 flex-col items-stretch justify-center gap-6 `,
	}

	return (
		<MotiView
			key={"question"}
			style={styles.container}
			from={{
				opacity: 0,
				scale: 0.5,
			}}
			animate={{
				opacity: 1,
				scale: 1,
			}}
			exit={{
				opacity: 0,
				scale: 0,
				translateY: 100,
			}}
			transition={{
				type: "timing",
				duration: 500,
			}}
			exitTransition={{
				type: "timing",
				duration: 2000,
			}}
		>
			<Text className={styles.question}>
				{questions[currentQuestionIndex]?.question}
			</Text>
			{waitingForPlayers ? (
				<MotiView
					key={"waiting-for-players"}
					style={styles.card}
					from={{
						opacity: 0,
					}}
					animate={{
						opacity: 1,
					}}
					className={styles.options}
				>
					<View className="flex h-96 items-center justify-center gap-20">
						<Text className="text-center text-2xl">
							Waiting for other players to submit their answers
						</Text>
						<View className="flex flex-row items-center justify-center gap-2">
							<Avatar.Icon
								size={40}
								icon="account"
								style={{
									backgroundColor: theme.colors.surface,
								}}
							/>
							<Avatar.Icon
								size={40}
								icon="account"
								style={{
									backgroundColor: theme.colors.accent,
								}}
							/>
							<Avatar.Icon
								size={40}
								icon="account"
								style={{
									backgroundColor: theme.colors.surface,
								}}
							/>
							<Avatar.Icon
								size={40}
								icon="account"
								style={{
									backgroundColor: theme.colors.surface,
								}}
							/>
						</View>
					</View>
				</MotiView>
			) : !hasSubmitted ? (
				<MotiView
					key={"answer"}
					from={{
						opacity: 0,
					}}
					animate={{
						opacity: 1,
					}}
					exit={{
						opacity: 0,
					}}
					transition={{
						type: "spring",
						duration: 500,
					}}
					style={styles.card}
				>
					<InputField
						value={userAnswer}
						onChangeText={setUserAnswer}
						placeholder="Enter your answer"
						error={error}
					/>
				</MotiView>
			) : (
				<MotiView
					key={"options"}
					style={styles.card}
					from={{
						opacity: 0,
					}}
					animate={{
						opacity: 1,
					}}
					className={styles.options}
				>
					{possibleAnswers.map((option, index) => (
						<QuestionOption
							key={index}
							label={option.answer}
							isSelected={
								possibleAnswers[index]?.answer ===
									selectedAnswer && hasSelectedAnswer
							}
							showResult={false}
							onPress={() => {
								possibleAnswers[index]!.answer = option.answer
								selectPossibleAnswer(option)
							}}
						/>
					))}
				</MotiView>
			)}
		</MotiView>
	)
}
