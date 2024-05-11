import type { StateCreator } from "zustand"

import type { GameStore } from "."
import type { PossibleAnswer, Question } from "../../../types"
import type { GameRound, SubmittedAnswer } from "~/graphql/api"
import type { Subscription } from "~/types"

import { SubmittedAnswerApi } from "~/apis"
import GameRoundApi from "~/apis/game-round.api"
import { useUserStore } from "~/stores"

import { randomQuestion } from "../../../assets"

type MultiplayerSessionStates = {
	sessionQuestions: Question[]
	gameRound: GameRound | null
	submittedAnswers: SubmittedAnswer[]
	selectedPossibleAnswer: PossibleAnswer | null
	loading: boolean
	error: string | null
}

type MultiplayerSessionActions = {
	initializeGameRound(): Promise<void>
	selectPossibleAnswer(answer: string): void
	submitAnswer(): Promise<void>
	nextRound(): Promise<void>
	destroy(): void
}

export type MultiplayerSessionSlice = MultiplayerSessionStates &
	MultiplayerSessionActions

const createMultiplayerSessionSlice: StateCreator<
	GameStore,
	[],
	[],
	MultiplayerSessionSlice
> = (set, get) => {
	const gameRoundApi = new GameRoundApi()
	const submittedAnswerApi = new SubmittedAnswerApi()

	let gameRoundSubscription: Subscription | null = null
	let submittedAnswerSubscription: Subscription | null = null

	const onGameRoundSubscription = (gameSessionId: string) => {
		//Log current user email
		console.log(useUserStore.getState().currentUser?.email)

		gameRoundSubscription = gameRoundApi.subscribe(
			{
				filter: {
					gameSessionID: { eq: gameSessionId },
				},
			},
			({ type, data: gameRound }) => {
				console.log(type, gameRound)

				if (type === "created") {
					set({
						gameRound,
					})
					onSubmittedAnswerSubscription(gameRound.id)
				}
			},
		)

		return gameRoundSubscription
	}

	const onSubmittedAnswerSubscription = (gameRoundID: string) => {
		if (submittedAnswerSubscription) {
			submittedAnswerSubscription.unsubscribe()
		}

		submittedAnswerSubscription = submittedAnswerApi.subscribe(
			{
				filter: {
					gameRoundID: { eq: gameRoundID },
				},
			},
			({ type, data: submittedAnswer }) => {
				console.log(type, submittedAnswer)

				set({
					submittedAnswers: [
						...get().submittedAnswers,
						submittedAnswer,
					],
				})
			},
		)

		return submittedAnswerSubscription
	}

	return {
		sessionQuestions: [],
		gameRound: null,
		submittedAnswers: [],
		selectedPossibleAnswer: null,
		loading: false,
		error: null,

		initializeGameRound: async (): Promise<void> => {
			set({
				selectedAnswer: null,
				submittedAnswers: [],
				selectedPossibleAnswer: null,
				error: null,
			})

			if (!get().isCreator) {
				const gameSessionID = get().gameSessionID

				onGameRoundSubscription(gameSessionID!)

				return
			}

			if (get().loading) return

			set({ loading: true })

			const newQuestion = randomQuestion(get().sessionQuestions)

			try {
				const gameRound = get().gameRound

				const response = await gameRoundApi.create({
					gameSessionID: get().gameSessionID!,
					index: gameRound ? gameRound.index + 1 : 0,
					question: newQuestion.question,
					correctAnswer: newQuestion.correctAnswer,
					isComplete: false,
				})

				if (response.hasError) {
					set({
						error: "Failed to create game round",
						loading: false,
					})

					return
				}

				set({
					sessionQuestions: [...get().sessionQuestions, newQuestion],
					loading: false,
					gameRound: response.item,
				})

				onGameRoundSubscription(get().gameSessionID!)
			} catch (error) {
				set({
					error: "Failed to create game round",
					loading: false,
				})
			}
		},

		selectPossibleAnswer: (answer: string) => {
			set({
				selectedPossibleAnswer: {
					userId: useUserStore.getState().currentUser!.id,
					answer,
				},
			})
		},

		submitAnswer: async (): Promise<void> => {
			if (get().loading) return

			set({ loading: true })

			try {
				const response = await submittedAnswerApi.create({
					answer: get().selectedPossibleAnswer!.answer,
					userID: useUserStore.getState().currentUser!.id,
					gameRoundID: get().gameRound!.id,
				})

				if (response.hasError) {
					set({
						error: "Failed to submit answer",
						loading: false,
					})

					return
				}

				set({
					loading: false,
				})
			} catch (error) {
				set({
					error: "Failed to submit answer",
					loading: false,
				})
			}
		},

		nextRound: async (): Promise<void> => {
			if (!get().isCreator) return

			if (get().loading) return

			set({ loading: true })

			try {
				const gameRound = get().gameRound

				if (!gameRound) {
					set({
						loading: false,
					})

					return
				}

				const response = await gameRoundApi.update({
					id: gameRound.id,
					isComplete: true,
				})

				if (response.hasError) {
					set({
						error: "Failed to update game round",
						loading: false,
					})

					return
				}

				set({
					loading: false,
				})
			} catch (error) {
				set({
					error: "Failed to update game round",
					loading: false,
				})
			}
		},

		destroy: () => {
			if (gameRoundSubscription) {
				gameRoundSubscription.unsubscribe()
			}

			if (submittedAnswerSubscription) {
				submittedAnswerSubscription.unsubscribe()
			}
		},
	}
}

export default createMultiplayerSessionSlice
