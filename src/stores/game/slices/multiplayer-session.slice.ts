import type { StateCreator } from "zustand"

import type { GameStore } from "."
import type { GameRound, SubmittedAnswer } from "~/graphql/api"
import type { PossibleAnswer, Question, Subscription } from "~/types"

import { SubmittedAnswerApi } from "~/apis"
import GameRoundApi from "~/apis/game-round.api"
import { randomQuestion } from "~/assets"

import useUserStore from "../../user/useUserStore"

type MultiplayerSessionStates = {
	sessionQuestions: Question[]
	gameRound: GameRound | null
	submittedAnswers: SubmittedAnswer[]
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

	const onGameRoundSubscription = (gameSessionId: string) => {
		gameRoundSubscription = gameRoundApi.subscribe(
			{
				filter: {
					gameSessionID: { eq: gameSessionId },
				},
			},
			({ type, data: gameRound }) => {
				if (type === "created") {
					set({
						gameRound,
					})
					onSubmittedAnswerSubscription(gameRound.id)
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
			({ data: submittedAnswer }) => {
				const removeDuplicates = (
					submittedAnswers: SubmittedAnswer[],
				) => {
					const ids = new Set()

					return submittedAnswers.filter((item: SubmittedAnswer) => {
						if (!ids.has(item.id)) {
							ids.add(item.id)

							return true
						}

						return false
					})
				}

				set({
					submittedAnswers: removeDuplicates([
						...get().submittedAnswers,
						submittedAnswer,
					]),
				})

				let answers = get().submittedAnswers.filter(
					(answer) => answer.gameRoundID === get().gameRound?.id,
				)

				if (answers.length === get().participants.length) {
					answers.map((answer) => {
						if (answer.answer === get().gameRound?.correctAnswer) {
							set({
								scores: {
									...get().scores,
									[answer.userID]: get().scores[answer.userID]
										? get().scores[answer.userID]! + 1
										: 1,
								},
							})
						}
					})

					get().completeRound()
				}
			},
		)

		return submittedAnswerSubscription
	}

	return {
		sessionQuestions: [],
		gameRound: null,
		submittedAnswers: [],
		selectedPossibleAnswer: null,
		scores: {},
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
				onSubmittedAnswerSubscription(response.item!.id)
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

			set({ loading: true })

			if (
				get().submittedAnswers.find(
					(answer) =>
						answer.userID ===
							useUserStore.getState().currentUser!.id &&
						answer.gameRoundID === get().gameRound?.id,
				)
			) {
				set({
					loading: false,
				})

				return
			}

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

				const removeDuplicates = (
					submittedAnswers: SubmittedAnswer[],
				) => {
					const ids = new Set()

					return submittedAnswers.filter((item: SubmittedAnswer) => {
						if (!ids.has(item.id)) {
							ids.add(item.id)

							return true
						}

						return false
					})
				}

				set({
					loading: false,
					submittedAnswers: removeDuplicates([
						...get().submittedAnswers,
						response.item!,
					]),
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
