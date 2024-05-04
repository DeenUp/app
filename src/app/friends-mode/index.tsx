import type { ReactNode } from "react"

import { useEffect } from "react"
import { SafeAreaView, TouchableOpacity } from "react-native"

import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"

import AntIcons from "@expo/vector-icons/AntDesign"
import { AnimatePresence, MotiView } from "moti"
import twr from "twrnc"

import type { GameStore, SettingsStore } from "~/stores"

import { QuestionAndAnswer, Scores } from "~/components/gameplay"
import QuestionHeader from "~/components/gameplay/QuestionHeader"
import { Button } from "~/components/ui"
import { tw } from "~/helpers"
import { useGameStore, useSettingsStore } from "~/stores"

export default function Page(): ReactNode {
	const theme = useSettingsStore((state: SettingsStore) => state.theme)

	const { minutes, seconds, countdown, settime, stop } = useGameStore(
		(state: GameStore) => ({
			minutes: state.minutes,
			seconds: state.seconds,
			stop: state.stop,
			countdown: state.countdown,
			settime: state.setTime,
		}),
	)

	const {
		currentQuestionIndex,
		questions,
		userAnswer,
		hasSubmitted,
		hasSelectedAnswer,
		waitingForPlayers,
		loading,
		showRoundResult,
		initializeSessionQuestions,
		submitPossibleAnswer,
		submitAnswer,
		reset,
	} = useGameStore((state: GameStore) => ({
		currentQuestionIndex: state.currentSessionQuestionIndex,
		hasSubmitted: state.hasSubmittedAnswer,
		questions: state.questions,
		userAnswer: state.userAnswer,
		hasSelectedAnswer: state.hasSelectedAnswer,
		waitingForPlayers: state.waitingForPlayers,
		showRoundResult: state.showRoundResult,
		loading: state.loading,
		error: state.error,
		submitPossibleAnswer: state.submitPossibleAnswer.bind(state),
		selectPossibleAnswer: state.selectPossibleAnswer.bind(state),
		setUserAnswer: state.setUserAnswer.bind(state),
		submitAnswer: state.submitAnswer.bind(state),
		initializeSessionQuestions:
			state.initializeSessionQuestions.bind(state),
		reset: state.reset.bind(state),
	}))

	useEffect(() => {
		stop()
		settime(0, 5)
		countdown()
		initializeSessionQuestions()

		return stop
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleSubmit = () => {
		if (!hasSubmitted) {
			submitPossibleAnswer("Tester", userAnswer)
		}
		if (hasSelectedAnswer) {
			submitAnswer()
		}
	}

	const styles = {
		body: tw`shadow-offset-x-10 shadow-offset-y-5 mx-6 mb-2 flex flex h-72 flex-col items-stretch justify-around rounded-md bg-white p-12 shadow-md`,
		question: tw`text-center text-2xl font-bold`,
		options: tw`gap-6`,
		buttonsContainer: tw`flex flex-row justify-between px-6`,
		buttons: tw`w-1/4`,
		closeButton: tw`absolute right-10 top-14 z-20 size-10`,
	}

	return (
		<SafeAreaView
			style={{
				flex: 1,
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "flex-start",
				backgroundColor: theme.colors.primary,
			}}
		>
			<StatusBar style="light" />

			<TouchableOpacity
				className={styles.closeButton}
				onPress={() => {
					reset()
					router.dismissAll()
				}}
			>
				<AntIcons name="closecircle" color={"white"} size={32} />
			</TouchableOpacity>
			{!showRoundResult && (
				<QuestionHeader
					index={currentQuestionIndex + 1}
					length={questions.length}
					minutes={minutes}
					seconds={seconds}
				/>
			)}

			<AnimatePresence exitBeforeEnter>
				{showRoundResult ? <Scores /> : <QuestionAndAnswer />}
			</AnimatePresence>
			{!waitingForPlayers && !showRoundResult && (
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
					style={twr`w-2/3`}
				>
					<Button
						isLoading={loading}
						label={"Submit Answer"}
						onPress={() => handleSubmit()}
						color="accent"
						buttonStyle="shadow-md px-6 mt-10 w-full"
						size="lg"
					/>
				</MotiView>
			)}
		</SafeAreaView>
	)
}
