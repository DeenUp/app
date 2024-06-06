import type { StateCreator } from "zustand"

import type { GameStore } from "."
import type { GameRound, SubmittedAnswer } from "~/graphql/api"
import type { PossibleAnswer, Question, Subscription } from "~/types"

import { SubmittedAnswerApi } from "~/apis"
import GameRoundApi from "~/apis/game-round.api"
import { randomQuestion } from "~/assets"
import { removeDuplicates } from "~/utils"

import useUserStore from "../../user/useUserStore"

type MultiplayerSessionStates = {
	sessionQuestions: Question[]
	gameRound: GameRound | null
	submittedAnswers: Record<string, SubmittedAnswer[]>
	selectedPossibleAnswer: PossibleAnswer | null
	scores: Record<string, number>
	loading: boolean
	error: string | null
}

type MultiplayerSessionActions = {
	initializeGameRound(): Promise<void>
	selectPossibleAnswer(answer: string): void
	submitAnswer(): Promise<void>
	completeRound(): Promise<void>
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

	const onGameRoundSubscription = (gameSessionID: string) => {
		gameRoundSubscription = gameRoundApi.subscribe(
			{
				filter: {
					gameSessionID: { eq: gameSessionID },
				},
			},
			({ type, data: gameRound }) => {
				if (type === "created") {
					set({
						gameRound,
						submittedAnswers: {
							...get().submittedAnswers,
							[gameRound.id]: [],
						},
					})
				}

				if (type === "updated") {
					set({
						gameRound,
					})
				}
			},
		)

		return gameRoundSubscription
	}

	const onSubmittedAnswerSubscription = (gameSessionID: string) => {
		if (submittedAnswerSubscription) {
			submittedAnswerSubscription.unsubscribe()
		}

		submittedAnswerSubscription = submittedAnswerApi.subscribe(
			{
				filter: {
					gameSessionID: { eq: gameSessionID },
				},
			},
			({ data: submittedAnswer }) => {
				const { gameRoundID } = submittedAnswer
				const currentRoundAnswers = get().submittedAnswers[gameRoundID]!

				set({
					submittedAnswers: {
						...get().submittedAnswers,
						[gameRoundID]: removeDuplicates<SubmittedAnswer>([
							...currentRoundAnswers,
							submittedAnswer,
						]),
					},
				})

				if (
					get().submittedAnswers[gameRoundID]!.length ===
					get().participants.length
				) {
					get().submittedAnswers[gameRoundID]!.forEach(
						({ isCorrect, userID }) => {
							const { scores } = get()
							const userScore = scores[userID] ?? 0

							set({
								scores: {
									...scores,
									[userID]: isCorrect
										? userScore + 10
										: userScore,
								},
							})
						},
					)

					get().completeRound()
				}
			},
		)

		return submittedAnswerSubscription
	}

	return {
		sessionQuestions: [],
		gameRound: null,
		submittedAnswers: {},
		selectedPossibleAnswer: null,
		scores: {},
		loading: false,
		error: null,

		initializeGameRound: async (): Promise<void> => {
			set({
				selectedAnswer: null,
				selectedPossibleAnswer: null,
				error: null,
			})

			const gameSessionID = get().gameSessionID!

			onGameRoundSubscription(gameSessionID)
			onSubmittedAnswerSubscription(gameSessionID)

			const currentGameRound = get().gameRound

			if (currentGameRound && !currentGameRound.isComplete) {
				set({ loading: false })

				const submittedAnswersResponse =
					await submittedAnswerApi.listByGameSessionID(gameSessionID)
				const submittedAnswers = submittedAnswersResponse.item

				if (submittedAnswers) {
					set({
						submittedAnswers: {
							...get().submittedAnswers,
							[currentGameRound.id]: submittedAnswers,
						},
					})
				}

				return
			}

			if (!get().isCreator) return

			if (get().loading) return

			set({ loading: true })

			const newQuestion = randomQuestion(get().sessionQuestions)

			try {
				const response = await gameRoundApi.create({
					gameSessionID,
					index: currentGameRound ? currentGameRound.index + 1 : 1,
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

				const newGameRound = response.item!

				set({
					sessionQuestions: [...get().sessionQuestions, newQuestion],
					submittedAnswers: {
						...get().submittedAnswers,
						[newGameRound.id]: [],
					},
					loading: false,
					gameRound: newGameRound,
				})
			} catch (error) {
				console.error(error)
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
			if (!get().selectedPossibleAnswer) return

			set({ loading: true })

			const { id, correctAnswer } = get().gameRound!
			const { answer } = get().selectedPossibleAnswer!
			const currentRoundAnswers = get().submittedAnswers[id]
			const didSubmitAnswer = currentRoundAnswers?.find(
				(answer) =>
					answer.userID === useUserStore.getState().currentUser!.id,
			)

			if (didSubmitAnswer) {
				set({
					loading: false,
				})

				return
			}

			try {
				const response = await submittedAnswerApi.create({
					answer,
					isCorrect: answer === correctAnswer,
					userID: useUserStore.getState().currentUser!.id,
					gameRoundID: id,
					gameSessionID: get().gameSessionID!,
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
					submittedAnswers: {
						...get().submittedAnswers,
						[id]: removeDuplicates<SubmittedAnswer>([
							...get().submittedAnswers[id]!,
							response.item!,
						]),
					},
				})
			} catch (error) {
				console.error(error)
				set({
					error: "Failed to submit answer",
					loading: false,
				})
			}
		},

		completeRound: async (): Promise<void> => {
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
					gameRound: response.item,
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
