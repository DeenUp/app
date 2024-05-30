import type { StateCreator } from "zustand"

import * as Haptics from "expo-haptics"

import type { GameStore } from "."
import type { Question } from "../../../types"

import { randomQuestions } from "../../../assets"

type SoloSessionStates = {
	currentQuestionIndex: number
	selectedAnswer: string | null
	showResult: boolean
	isNextPressed: boolean
	questions: Question[]
	correctQuestions: Question[]
	incorrectQuestions: Question[]
	skippedQuestions: Question[]
}

type SoloSessionActions = {
	selectAnswer: (params: { answer: string }) => void
	answerQuestion: () => void
	skipQuestion: () => void
	nextQuestion: () => void
	resetSoloSession: () => void
}

export type SoloSessionSlice = SoloSessionStates & SoloSessionActions

const createSoloSessionSlice: StateCreator<
	GameStore,
	[],
	[],
	SoloSessionSlice
> = (set, get) => {
	return {
		currentQuestionIndex: 0,
		selectedAnswer: null,
		showResult: false,
		isNextPressed: false,
		questions: randomQuestions(10),
		correctQuestions: [],
		incorrectQuestions: [],
		skippedQuestions: [],
		selectAnswer: (params: { answer: string }) => {
			const { isNextPressed } = get()

			if (isNextPressed) return

			set({ selectedAnswer: params.answer })
		},
		answerQuestion: () => {
			const { currentQuestionIndex, selectedAnswer, questions } = get()
			const question = questions[currentQuestionIndex]

			if (!question) return
			if (!selectedAnswer) return

			if (question.correctAnswer === selectedAnswer) {
				Haptics.notificationAsync(
					Haptics.NotificationFeedbackType.Success,
				)
				set((state: SoloSessionStates) => ({
					showResult: true,
					correctQuestions: [...state.correctQuestions, question],
					isNextPressed: true,
				}))

				return
			}

			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
			set((state: SoloSessionStates) => ({
				showResult: true,
				incorrectQuestions: [...state.incorrectQuestions, question],
				isNextPressed: true,
			}))
		},
		skipQuestion: () => {
			const { questions, currentQuestionIndex } = get()
			const question = questions[currentQuestionIndex]

			if (!question) return

			set((state: SoloSessionStates) => ({
				currentQuestionIndex: state.currentQuestionIndex + 1,
				skippedQuestions: [...state.skippedQuestions, question],
			}))
		},
		nextQuestion: () => {
			const { currentQuestionIndex, selectedAnswer } = get()

			if (!selectedAnswer) return

			set({
				currentQuestionIndex: currentQuestionIndex + 1,
				selectedAnswer: null,
				showResult: false,
				isNextPressed: false,
			})
		},
		resetSoloSession: () => {
			set({
				currentQuestionIndex: 0,
				selectedAnswer: null,
				showResult: false,
				isNextPressed: false,
				questions: randomQuestions(10),
				correctQuestions: [],
				incorrectQuestions: [],
				skippedQuestions: [],
			})
		},
	}
}

export default createSoloSessionSlice
