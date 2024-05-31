import type { ReactNode } from "react"

import { useEffect, useState } from "react"
import { SafeAreaView, Text, View } from "react-native"
import { useAnimatedStyle, withSpring } from "react-native-reanimated"

import * as Haptics from "expo-haptics"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"

import { AnimatePresence, MotiView } from "moti"
import twr from "twrnc"

import Placeholder from "~/components/gameplay/Placeholder"
import QuestionHeader from "~/components/gameplay/QuestionHeader"
import QuestionOption from "~/components/gameplay/QuestionOption"
import { CloseButton, Spacer, ThemedAwesomeButton } from "~/components/ui"
import { tw } from "~/helpers"
import { useGameStore, useSettingsStore } from "~/stores"

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

	const optionHeight = 85

	const styles = {
		screen: twr`flex-1 flex-col items-center justify-center bg-[${theme.primary}] px-6 pt-12`,
		card: twr`flex w-96 flex-grow flex-col items-stretch justify-around rounded-md bg-[${theme.background}] p-8 shadow-md`,
		question: tw`w-full text-left text-2xl font-bold`,
		options: tw`gap-4`,
		closeButton: tw`w-full flex-col items-end justify-end justify-between p-6`,
	}

	const [selectedIndex, setSelectedIndex] = useState<number>(-1)

	useEffect(() => {
		const index = questions[currentQuestionIndex]?.options.findIndex(
			(option) => option === selectedAnswer,
		)

		if (index === undefined) return

		if (index !== -1) {
			setSelectedIndex(index)
		}
	}, [selectedAnswer])

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: withSpring(selectedIndex * optionHeight),
				},
			],
		}
	})

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

			<AnimatePresence exitBeforeEnter>
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
										isSelected={selectedAnswer === option}
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
							{selectedIndex !== -1 && (
								<MotiView
									exit={{
										opacity: 0,
										translateY: -100,
									}}
									style={[
										twr`rounded-4 absolute left-0 right-0 top-0 -z-10 h-[${optionHeight}px] w-full  bg-[${theme.surface}] shadow-md`,
										animatedStyle,
									]}
								/>
							)}
						</View>
					</MotiView>
				)}
			</AnimatePresence>
			<ThemedAwesomeButton
				type="anchor"
				size="large"
				width={370}
				height={70}
				textSize={20}
				style={twr`mt-8`}
				progress
				onPress={(next) => {
					if (!selectedAnswer || !questions[currentQuestionIndex]) {
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
							setSelectedIndex(-1)
							//@ts-ignore
							next()
						}
					}, 5000)
				}}
			>
				{questions.length - 1 === currentQuestionIndex
					? "Submit"
					: "Next"}
			</ThemedAwesomeButton>

			<Spacer />
		</SafeAreaView>
	)
}
