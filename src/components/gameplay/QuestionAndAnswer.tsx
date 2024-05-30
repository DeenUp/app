import { useEffect, useState } from "react"
import { Text } from "react-native"
import { useAnimatedStyle, withSpring } from "react-native-reanimated"

import { MotiView } from "moti"
import twr from "twrnc"

import type { GameStore, UserStore } from "~/stores"

import { questions } from "~/assets"
import { tw } from "~/helpers"
import { useGameStore, useUserStore } from "~/stores"

import Placeholder from "./Placeholder"
import QuestionOption from "./QuestionOption"

export default function QuestionAndAnswer() {
	const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
		undefined,
	)

	const currentUser = useUserStore((state: UserStore) => state.currentUser)

	const {
		gameRound,
		selectPossibleAnswer,
		selectedPossibleAnswer,
		submittedAnswers,
	} = useGameStore((state: GameStore) => ({
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

	const styles = {
		container: twr`flex h-[70%] w-[95%] flex-col items-center justify-center gap-6 rounded-xl bg-white p-4`,
		options: tw`gap-6`,
		question: tw`text-center text-2xl font-bold`,
		card: twr`h-full w-full flex-1 flex-col items-stretch justify-center gap-6 bg-[#F9F2DF]`,
	}
	const OptionHeight = 90

	useEffect(() => {
		const question = questions.find(
			(question) => question.question === gameRound?.question,
		)

		const index = question?.options.findIndex(
			(option) => option === selectedPossibleAnswer?.answer,
		)

		if (index !== -1) {
			setSelectedIndex(index)
		}
	}, [selectedPossibleAnswer])

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: withSpring(
						(selectedIndex as number) * OptionHeight,
					),
				},
			],
		}
	})

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
			<Text className={styles.question}>{gameRound?.question}</Text>

			{submittedAnswers[gameRound!.id]?.find(
				(answer) =>
					answer.userID === currentUser?.id &&
					answer.gameRoundID === gameRound?.id,
			) ? (
				<Placeholder solo={false} />
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
										selectedPossibleAnswer?.answer ===
										option
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
					)
				</MotiView>
			)}
		</MotiView>
	)
}
