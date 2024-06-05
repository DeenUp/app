import { useEffect, useState } from "react"
import { Text } from "react-native"
import { useAnimatedStyle, withSpring } from "react-native-reanimated"

import { MotiView } from "moti"
import twr from "twrnc"

import type { GameStore } from "~/stores"

import { questions } from "~/assets"
import { tw } from "~/helpers"
import { useGameStore, useSettingsStore } from "~/stores"

import QuestionOption from "./QuestionOption"

export default function QuestionAndAnswer() {
	const [selectedIndex, setSelectedIndex] = useState<number>(-1)
	const { theme } = useSettingsStore()
	const { gameRound, selectPossibleAnswer, selectedPossibleAnswer } =
		useGameStore((state: GameStore) => ({
			gameRound: state.gameRound,
			loading: state.loading,
			error: state.error,
			initializeGameRound: state.initializeGameRound,
			selectPossibleAnswer: state.selectPossibleAnswer,
			selectedPossibleAnswer: state.selectedPossibleAnswer,
			submittedAnswers: state.submittedAnswers,
			submitAnswer: state.submitAnswer,
			participants: state.participants,
			sessionQuestions: state.sessionQuestions,
			currentQuestionIndex: state.currentQuestionIndex,
		}))

	const OptionHeight = 85

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: withSpring(selectedIndex * OptionHeight),
				},
			],
		}
	})

	useEffect(() => {
		const question = questions.find(
			(question) => question.question === gameRound?.question,
		)

		const index = question?.options.findIndex(
			(option) => option === selectedPossibleAnswer?.answer,
		)

		if (index === undefined) return

		if (index !== -1) {
			setSelectedIndex(index)
		}
	}, [selectedPossibleAnswer])

	const styles = {
		card: twr`flex w-full flex-grow flex-col items-stretch justify-around rounded-md bg-[${theme.background}] p-8 shadow-md`,
		options: twr`gap-4`,
		question: tw`text-center text-2xl font-bold`,
	}

	return (
		<MotiView
			key={"question"}
			style={styles.card}
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
			<Text className={styles.question}>{gameRound?.question}</Text>
			<MotiView style={styles.options}>
				{gameRound &&
					questions
						.find(
							(question) =>
								question.question === gameRound?.question,
						)
						?.options.map((option, index) => (
							<QuestionOption
								index={index + 1}
								key={index}
								label={option}
								isSelected={
									selectedPossibleAnswer?.answer === option
								}
								showResult={false}
								onPress={() => {
									selectPossibleAnswer(option)
								}}
							/>
						))}
				{selectedIndex !== -1 && (
					<MotiView
						style={[
							{
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								height: OptionHeight,
								borderWidth: 2,
								borderColor: "#472836",
								borderRadius: 12,
								backgroundColor: "#FEFFBE",
								width: "100%",
								zIndex: -1,
								shadowColor: "#000",
								shadowOffset: {
									width: 0,
									height: 2,
								},
								shadowOpacity: 0.25,
								shadowRadius: 3.84,
							},
							animatedStyle,
						]}
					/>
				)}
			</MotiView>
		</MotiView>
	)
}
