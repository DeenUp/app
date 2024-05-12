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
		submittedAnswers,
		participants,
		gameRound,
		loading,
		initializeGameRound,
		submitAnswer,
		nextRound,
	} = useGameStore((state: GameStore) => ({
		gameRound: state.gameRound,
		loading: state.loading,
		error: state.error,
		initializeGameRound: state.initializeGameRound,
		submitAnswer: state.submitAnswer,
		nextRound: state.nextRound,
		submittedAnswers: state.submittedAnswers,
		participants: state.participants,
	}))

	useEffect(() => {
		stop()
		settime(0, 5)
		countdown()
		initializeGameRound()

		return stop
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const styles = {
		body: tw`shadow-offset-x-10 shadow-offset-y-5 mx-6 mb-2 flex h-72 flex-col items-stretch justify-around rounded-md bg-white p-12 shadow-md`,
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
					router.dismissAll()
				}}
			>
				<AntIcons name="closecircle" color={"white"} size={32} />
			</TouchableOpacity>
			{!gameRound?.isComplete && (
				<QuestionHeader
					index={gameRound?.index ?? 0}
					length={10}
					minutes={minutes}
					seconds={seconds}
				/>
			)}

			<AnimatePresence exitBeforeEnter>
				{gameRound?.isComplete ? <Scores /> : <QuestionAndAnswer />}
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
					style={twr`w-2/3`}
				>
					<Button
						isLoading={loading}
						label={"Submit Answer"}
						onPress={() => {
							let answers = submittedAnswers.map(
								(answer) =>
									answer.gameRoundID === gameRound?.id,
							)
							answers.length !== participants.length
								? submitAnswer()
								: nextRound()
						}}
						color="accent"
						buttonStyle="shadow-md px-6 mt-10 w-full"
						size="lg"
					/>
				</MotiView>
			)}
		</SafeAreaView>
	)
}
