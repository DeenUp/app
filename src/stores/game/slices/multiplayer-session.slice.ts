import type { StateCreator } from "zustand"

import type { GameStore } from "."
import type { Player, PossibleAnswer, Question } from "../../../types"

import { randomQuestions } from "../../../assets"

type MultiplayerSessionStates = {
	id: string | null
	sessionPlayers: Player[]
	sessionQuestions: Question[]
	possibleAnswers: PossibleAnswer[]
	userAnswer: string
	selectedAnswer: string | null
	hasSubmittedAnswer: boolean
	hasSelectedAnswer: boolean
	currentSessionQuestionIndex: number
	waitingForPlayers: boolean
	showRoundResult: boolean
	loading: boolean
	error: string | null
}

type MultiplayerSessionActions = {
	initializeSessionQuestions(): void
	submitPossibleAnswer(usserId: string, answer: string): void
	selectPossibleAnswer(answer: PossibleAnswer): void
	setUserAnswer(answer: string): void
	submitAnswer(): void
	nextRound(): void
	reset(): void
}

export type MultiplayerSessionSlice = MultiplayerSessionStates &
	MultiplayerSessionActions

const createMultiplayerSessionSlice: StateCreator<
	GameStore,
	[],
	[],
	MultiplayerSessionSlice
> = (set, get) => {
	return {
		id: null,
		sessionPlayers: [],
		sessionQuestions: [],
		currentSessionQuestionIndex: 0,
		possibleAnswers: [],
		userAnswer: "",
		hasSubmittedAnswer: false,
		hasSelectedAnswer: false,
		selectedAnswer: null,
		waitingForPlayers: false,
		showRoundResult: false,
		loading: false,
		error: null,

		initializeSessionQuestions: () => {
			set({ sessionQuestions: randomQuestions(10) })
			const answer =
				get().sessionQuestions[get().currentSessionQuestionIndex]
					?.correctAnswer
			set({
				possibleAnswers: [{ userId: "NA", answer: answer! }],
			})
		},

		submitPossibleAnswer: (userId, answer) => {
			if (get().hasSubmittedAnswer) return
			if (!answer) return set({ error: "Please select an answer" })
			if (
				answer ===
				get().sessionQuestions[get().currentSessionQuestionIndex]
					?.correctAnswer
			) {
				return set({ error: "Please submit a different answer" })
			}

			set({
				loading: true,
			})

			setTimeout(() => {
				set((state: MultiplayerSessionStates) => ({
					possibleAnswers: [
						...state.possibleAnswers,
						{ userId, answer },
					],
					hasSubmittedAnswer: true,
					loading: false,
					waitingForPlayers: true,
				}))
			}, 2000)

			setTimeout(() => {
				set({
					waitingForPlayers: false,
				})
			}, 5000)
		},

		selectPossibleAnswer: (answer) => {
			set({
				selectedAnswer: answer.answer,
				hasSelectedAnswer: true,
			})
		},

		submitAnswer: () => {
			if (!get().selectedAnswer) {
				return set({ error: "Please enter an answer" })
			}

			set({
				loading: true,
			})

			setTimeout(() => {
				set({
					waitingForPlayers: true,

					loading: true,
				})
			}, 2000)

			setTimeout(() => {
				const correctAnswer =
					get().sessionQuestions[get().currentSessionQuestionIndex]
						?.correctAnswer
				set((state: MultiplayerSessionStates) => ({
					waitingForPlayers: false,
					showRoundResult: true,
					currentSessionQuestionIndex:
						state.currentSessionQuestionIndex + 1,
					selectedAnswer: null,
					userAnswer: "",
					hasSubmittedAnswer: false,
					hasSelectedAnswer: false,
					possibleAnswers: [
						correctAnswer
							? { userId: "NA", answer: correctAnswer }
							: { userId: "NA", answer: "No answer" },
					],
					loading: false,
					error: null,
				}))
			}, 5000)
		},

		setUserAnswer: (answer) => {
			set({ userAnswer: answer })
		},

		nextRound: () => {
			set({
				showRoundResult: false,
			})
		},

		reset: () => {
			set({
				id: null,
				sessionPlayers: [],
				sessionQuestions: [],
				currentSessionQuestionIndex: 0,
				possibleAnswers: [],
				userAnswer: "",
				hasSubmittedAnswer: false,
				hasSelectedAnswer: false,
				selectedAnswer: null,
				waitingForPlayers: false,
				showRoundResult: false,
				loading: false,
				error: null,
			})
		},
	}
}

export default createMultiplayerSessionSlice
