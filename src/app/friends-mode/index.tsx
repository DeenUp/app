import type { ReactNode } from "react"

import { useEffect } from "react"
import { SafeAreaView, Text, View } from "react-native"

import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"

import { AnimatePresence, MotiView } from "moti"
import twr from "twrnc"

import type { SubmittedAnswer } from "~/graphql/api"
import type { GameStore, SettingsStore, UserStore } from "~/stores"

import { Placeholder, QuestionAndAnswer, Scores } from "~/components/gameplay"
import QuestionHeader from "~/components/gameplay/QuestionHeader"
import { CloseButton, ThemedAwesomeButton } from "~/components/ui"
import { tw } from "~/helpers"
import { useGameStore, useSettingsStore, useUserStore } from "~/stores"

export default function Page(): ReactNode {
	const theme = useSettingsStore((state: SettingsStore) => state.theme)

	const { currentUser } = useUserStore((state: UserStore) => ({
		currentUser: state.currentUser,
	}))

	const {
		gameRound,
		initializeGameRound,
		submitAnswer,
		submittedAnswers,
		destroy,
	} = useGameStore((state: GameStore) => ({
		gameRound: state.gameRound,
		loading: state.loading,
		error: state.error,
		initializeGameRound: state.initializeGameRound,
		submitAnswer: state.submitAnswer,
		submittedAnswers: state.submittedAnswers,
		participants: state.participants,
		isCreator: state.isCreator,
		destroy: state.destroy,
		deactivateLoby: state.deactivateLobby,
	}))

	useEffect(() => {
		initializeGameRound()

		return () => {
			destroy()
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const styles = {
		screen: twr`flex-1 flex-col items-center justify-center bg-[${theme.primary}] pt-12`,
		container: twr`w-full flex-1 flex-col items-center justify-center p-4`,
		question: tw`text-center text-2xl font-bold`,
		buttonsContainer: tw`flex flex-row justify-between px-6`,
		closeButton: tw`w-full flex-col items-end justify-end justify-between p-6`,
		roundResultText: twr`absolute bottom-12 my-auto text-center text-xl font-semibold`,
	}

	return (
		<SafeAreaView style={styles.screen}>
			<StatusBar style="light" />

			<View className={styles.closeButton}>
				<CloseButton onPress={() => router.navigate("/")} />
				{!gameRound?.isComplete && (
					<QuestionHeader
						index={gameRound?.index ?? 0}
						length={10}
						timed={false}
					/>
				)}
			</View>
			<View style={styles.container}>
				{gameRound?.isComplete && (
					<MotiView
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
						}}
						transition={{
							delay: 100,
						}}
						exitTransition={{
							delay: 400,
						}}
						style={twr`mt-18 absolute w-2/3`}
					>
						<Text style={twr`text-center text-2xl text-white`}>
							{submittedAnswers[gameRound?.id]?.find(
								(answer: SubmittedAnswer) =>
									answer.userID === currentUser?.id &&
									answer.gameRoundID === gameRound?.id &&
									gameRound.correctAnswer === answer.answer,
							)
								? "Correct!"
								: "Incorrect!"}
						</Text>

						<Text
							style={twr`mt-4 text-center text-3xl font-bold text-white`}
						>
							{gameRound.correctAnswer}
						</Text>
					</MotiView>
				)}

				<AnimatePresence exitBeforeEnter>
					{gameRound?.isComplete ? (
						<Scores />
					) : gameRound &&
					  submittedAnswers[gameRound!.id]?.find(
							(answer) =>
								answer.userID === currentUser?.id &&
								answer.gameRoundID === gameRound?.id,
					  ) ? (
						<Placeholder solo={false} />
					) : (
						<QuestionAndAnswer />
					)}
				</AnimatePresence>

				{!gameRound?.isComplete && (
					<MotiView
						key="button"
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
						}}
						transition={{
							delay: 400,
						}}
					>
						<ThemedAwesomeButton
							type="anchor"
							size="large"
							width={350}
							height={70}
							textSize={20}
							style={twr`mt-8`}
							progress
							onPress={async (next) => {
								submitAnswer()
								//@ts-ignore
								next()

								return
							}}
						>
							{gameRound?.index === 10 ? "Submit" : "Next"}
						</ThemedAwesomeButton>
					</MotiView>
				)}
			</View>
		</SafeAreaView>
	)
}
