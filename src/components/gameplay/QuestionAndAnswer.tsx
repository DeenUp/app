import { Text, View } from "react-native"
import { Avatar } from "react-native-paper"

import { MotiView } from "moti"
import twr from "twrnc"

import type { GameStore, SettingsStore, UserStore } from "~/stores"

import { questions } from "~/assets"
import { tw } from "~/helpers"
import { useGameStore, useSettingsStore, useUserStore } from "~/stores"

import QuestionOption from "./QuestionOption"

export default function QuestionAndAnswer() {
	const theme = useSettingsStore((state: SettingsStore) => state.theme)

	const currentUser = useUserStore((state: UserStore) => state.currentUser)

	const {
		gameRound,
		selectPossibleAnswer,
		selectedPossibleAnswer,
		submittedAnswers,
		participants,
	} = useGameStore((state: GameStore) => ({
		gameRound: state.gameRound,
		loading: state.loading,
		error: state.error,
		initializeGameRound: state.initializeGameRound,
		selectPossibleAnswer: state.selectPossibleAnswer,
		selectedPossibleAnswer: state.selectedPossibleAnswer,
		submittedAnswers: state.submittedAnswers,
		submitAnswer: state.submitAnswer,
		nextRound: state.nextRound,
		participants: state.participants,
		sessionQuestions: state.sessionQuestions,
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
			<Text className={styles.question}>{gameRound?.question}</Text>
			{submittedAnswers.find(
				(answer) =>
					answer.userID === currentUser?.id &&
					answer.gameRoundID === gameRound?.id,
			) ? (
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
							{participants.map((participant) => (
								<Avatar.Icon
									key={participant.id}
									size={40}
									icon="account"
									style={{
										backgroundColor: submittedAnswers.find(
											(answer) =>
												answer.userID ===
													participant.userId &&
												answer.gameRoundID ===
													gameRound?.id,
										)
											? theme.colors.accent
											: theme.colors.surface,
									}}
								/>
							))}
						</View>
					</View>
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
					{gameRound &&
						questions
							.find(
								(question) =>
									question.question === gameRound?.question,
							)
							?.options.map((option, index) => (
								<QuestionOption
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
				</MotiView>
			)}
		</MotiView>
	)
}
