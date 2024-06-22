import type { ReactNode } from "react"

import { useEffect } from "react"
import { SafeAreaView, Text, View } from "react-native"

import * as Haptics from "expo-haptics"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"

import { AnimatePresence, MotiView } from "moti"
import twr from "twrnc"

import {
	Placeholder,
	QuestionHeader,
	QuestionOption,
	SelectionIndicator,
} from "~/components/gameplay"
import { CloseButton, ThemedAwesomeButton } from "~/components/ui"
import { useGameStore, useSettingsStore } from "~/stores"
import { tw } from "~/utils"

export default function Page(): ReactNode {
	const { theme } = useSettingsStore()
	const {
		minutes,
		seconds,
		start,
		stop,
		currentQuestionIndex,
		selectedAnswer,
		showResult,
		questions,
		selectAnswer,
		answerQuestion,
		nextQuestion,
		resetSoloSession,
	} = useGameStore()

	useEffect(() => {
		stop()
		start()
		resetSoloSession()
		// eslint-disable-next-line react-hooks/exhaustive-deps

		return () => {
			stop()
		}
	}, [])

	const OptionHeight = 85

	const styles = {
		screen: twr`flex-1 flex-col items-center justify-center bg-[${theme.primary}] pt-12`,
		container: twr`w-full flex-1 flex-col items-center justify-center p-4`,
		card: twr`relative flex w-full flex-grow flex-col items-stretch justify-around rounded-3xl border-4 border-black  bg-[${theme.background}] p-8 shadow-md`,
		question: tw`w-full text-center text-2xl font-bold`,
		options: tw`gap-4`,
		closeButton: tw`w-full flex-col items-end justify-end justify-between p-6`,
	}

	return (
		<SafeAreaView style={styles.screen}>
			<StatusBar style="light" />
			<View className={styles.closeButton}>
				<CloseButton onPress={() => router.navigate("/")} />
				<QuestionHeader
					index={currentQuestionIndex + 1}
					length={questions.length}
					minutes={minutes}
					seconds={seconds}
					timed={false}
				/>
			</View>
			<View style={styles.container}>
				<AnimatePresence>
					{showResult ? (
						<Placeholder solo={true} />
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
							style={styles.card}
						>
							<Text className={styles.question}>
								{questions[currentQuestionIndex]?.question}
							</Text>

							<View className={styles.options}>
								{questions[currentQuestionIndex]?.options.map(
									(option, index) => (
										<QuestionOption
											index={index + 1}
											key={index}
											label={option}
											isSelected={
												selectedAnswer === option
											}
											showResult={showResult}
											isCorrect={
												selectedAnswer ===
												questions[currentQuestionIndex]
													?.correctAnswer
											}
											onPress={() => {
												Haptics.impactAsync(
													Haptics.ImpactFeedbackStyle
														.Medium,
												)
												questions[index]!.userAnswer =
													option
												selectAnswer({ answer: option })
											}}
										/>
									),
								)}
								{selectedAnswer && (
									<SelectionIndicator
										selectedIndex={questions[
											currentQuestionIndex
										]?.options.indexOf(selectedAnswer)}
										optionHeight={OptionHeight}
									/>
								)}
							</View>
						</MotiView>
					)}
				</AnimatePresence>
				<ThemedAwesomeButton
					type="anchor"
					size="large"
					width={340}
					height={70}
					textSize={20}
					style={twr`mt-8`}
					progress
					onPress={(next) => {
						if (
							!selectedAnswer ||
							!questions[currentQuestionIndex]
						) {
							Haptics.notificationAsync(
								Haptics.NotificationFeedbackType.Error,
							)
							//@ts-ignore
							next()

							return
						}

						answerQuestion()

						setTimeout(() => {
							if (questions.length - 1 === currentQuestionIndex) {
								router.navigate("/result/")
								//@ts-ignore
								next()
							} else {
								nextQuestion()

								//@ts-ignore
								next()
							}
						}, 2500)
					}}
				>
					{questions.length - 1 === currentQuestionIndex
						? "Submit"
						: "Next"}
				</ThemedAwesomeButton>
			</View>
		</SafeAreaView>
	)
}
