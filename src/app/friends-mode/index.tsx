import type { ReactNode } from "react"

import { useEffect } from "react"
import { SafeAreaView, Text, TouchableOpacity } from "react-native"

import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"

import AntIcons from "@expo/vector-icons/AntDesign"
import { AnimatePresence, MotiView } from "moti"
import twr from "twrnc"

import type { SubmittedAnswer } from "~/graphql/api"
import type { GameStore, SettingsStore, UserStore } from "~/stores"

import { QuestionAndAnswer, Scores } from "~/components/gameplay"
import QuestionHeader from "~/components/gameplay/QuestionHeader"
import { Button } from "~/components/ui"
import { tw } from "~/helpers"
import { useGameStore, useSettingsStore, useUserStore } from "~/stores"

export default function Page(): ReactNode {
	const theme = useSettingsStore((state: SettingsStore) => state.theme)

	const { currentUser } = useUserStore((state: UserStore) => ({
		currentUser: state.currentUser,
	}))

	const {
		gameRound,
		loading,
		initializeGameRound,
		submitAnswer,
		submittedAnswers,
		isCreator,
		deactivateLoby,
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
			//	destroy()
			deactivateLoby()
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const styles = {
		body: tw`shadow-offset-x-10 shadow-offset-y-5 mx-6 mb-2 flex h-72 flex-col items-stretch justify-around rounded-md bg-white p-12 shadow-md`,
		question: tw`text-center text-2xl font-bold`,
		options: tw`gap-6`,
		buttonsContainer: tw`flex flex-row justify-between px-6`,
		buttons: tw`w-1/4`,
		closeButton: tw`absolute right-10 top-14 z-20 size-10 bg-transparent`,
		roundResultText: twr`absolute bottom-12 my-auto text-center text-xl font-semibold`,
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

			<Button
				buttonStyle={styles.closeButton}
				size="lg"
				iconSize={32}
				iconName="close"
				onPress={() => {
					router.dismissAll()
				}}
			/>
			{!gameRound?.isComplete && (
				<QuestionHeader
					index={gameRound?.index ?? 0}
					length={10}
					timed={false}
				/>
			)}

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
				{gameRound?.isComplete ? <Scores /> : <QuestionAndAnswer />}
			</AnimatePresence>
			{!gameRound?.isComplete ? (
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
							submitAnswer()
						}}
						color="accent"
						buttonStyle="shadow-md px-6 mt-10 w-full"
						size="lg"
					/>
				</MotiView>
			) : (
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
					delay={1000}
					style={twr`absolute bottom-12 flex w-full items-center justify-center `}
				>
					{isCreator ? (
						<Button
							isLoading={loading}
							label={
								gameRound?.index === 10
									? "View Results"
									: "Next Round"
							}
							onPress={
								gameRound?.index === 10
									? () => router.push("/friends-mode/result")
									: () => initializeGameRound()
							}
							color="primary"
							buttonStyle="shadow-md px-6 mt-2 w-2/3"
							size="lg"
						/>
					) : (
						<Text style={styles.roundResultText}>
							Waiting for host...
						</Text>
					)}
				</MotiView>
			)}
		</SafeAreaView>
	)
}
