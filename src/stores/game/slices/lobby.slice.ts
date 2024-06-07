import type { StateCreator } from "zustand"

import { Alert } from "react-native"

import { router } from "expo-router"

import useUserStore from "~stores/user/useUserStore"

import type { GameStore } from "."
import type { Subscription } from "~/types"
import type { Lobby, Participant } from "~graphql/api"

import { GameRoundApi, GameSessionApi, LobbyApi, ParticipantApi } from "~/apis"

type LobbyStates = {
	lobbyCode: string | null
	lobbyID: string | null
	gameSessionID: string | null
	participants: Participant[]
	isCreator: boolean
	loading: boolean
	error: string | null
}

type LobbyActions = {
	setIsCreator: (isCreator: boolean) => void
	createLobby: () => Promise<void>
	checkIfUserInLobby: (p: {
		onFound: (lobby: Lobby) => void
	}) => Promise<void>
	joinExistingLobby: (lobby: Lobby) => Promise<void>
	joinLobby: (lobbyCode: string) => Promise<void>
	leaveLobby: () => Promise<void>
	startGame: () => Promise<void>
	deactivateLobby: () => Promise<void>
}

export type LobbySlice = LobbyStates & LobbyActions

const createLobbySlice: StateCreator<GameStore, [], [], LobbySlice> = (
	set,
	get,
) => {
	const lobbyApi = new LobbyApi()
	const participantApi = new ParticipantApi()
	const gameSessionApi = new GameSessionApi()
	const gameRoundApi = new GameRoundApi()

	let participantSubscription: Subscription | null = null
	let gameSessionSubscription: Subscription | null = null
	let lobbySubscription: Subscription | null = null

	const onParticipantSubscription = (lobbyId: string) => {
		participantSubscription = participantApi.subscribe(
			{
				filter: {
					lobbyId: { eq: lobbyId },
				},
			},

			({ type, data: participant }) => {
				if (type === "deleted") {
					set({
						participants: get().participants.filter(
							(p) => p.id !== participant.id,
						),
					})

					return
				}

				const removeDuplicates = (
					array: Participant[],
				): Participant[] => {
					const ids = new Set()

					return array.filter((item: Participant) => {
						if (!ids.has(item.id)) {
							ids.add(item.id)

							return true
						}

						return false
					})
				}

				set({
					participants: removeDuplicates([
						...get().participants,
						participant,
					]),
				})
			},
		)

		return participantSubscription
	}

	const onGameSessionSubscription = (lobbyId: string) => {
		gameSessionSubscription = gameSessionApi.subscribe(
			{
				filter: {
					lobbyID: { eq: lobbyId },
				},
			},
			({ type, data: gameSession }) => {
				if (type === "created") {
					set({ gameSessionID: gameSession.id })
				}
			},
		)

		return gameSessionSubscription
	}

	const onLobbySubscription = (lobbyId: string) => {
		lobbySubscription = lobbyApi.subscribe(
			{ filter: { id: { eq: lobbyId } } },
			({ type, data: lobby }) => {
				if (type === "updated") {
					lobby.isActive === false &&
						set({
							lobbyCode: null,
							lobbyID: null,
							gameSessionID: null,
							participants: [],
							isCreator: false,
							loading: false,
							error: "",
						})

					Alert.alert(
						"Lobby closed",
						"The lobby has been closed by creator",
						[
							{
								text: "OK",
								onPress: () => {
									router.dismissAll()
								},
							},
						],
					)
				}
			},
		)

		return lobbySubscription
	}

	return {
		lobbyCode: null,
		lobbyID: null,
		gameSessionID: null,
		participants: [],
		isCreator: false,
		loading: false,
		error: "",

		setIsCreator: (isCreator) => {
			set({ isCreator })
		},

		createLobby: async (): Promise<void> => {
			if (get().loading) return

			set({ loading: true })

			const currentUser = useUserStore.getState().currentUser
			const lobbyCode = (): string => {
				const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
				let code = ""

				for (let i = 0; i < 6; i++) {
					code += characters.charAt(
						Math.floor(Math.random() * characters.length),
					)
				}

				return code
			}

			try {
				const lobbiesResponse = await lobbyApi.listById({
					id: currentUser!.id,
					filter: {
						isActive: { ne: false },
					},
				})

				if (lobbiesResponse.items!.length > 0) {
					const lobby = lobbiesResponse.items![0]!

					const participants = lobby.participants!.items.filter(
						(item): item is Participant => item !== null,
					)

					const allParticipants = [
						...get().participants,
						...participants,
					]

					set({
						lobbyCode: lobby.code,
						lobbyID: lobby.id,
						isCreator: true,
						loading: false,
						gameSessionID: lobby.gameSessionID || null,
						participants: Array.from(
							new Set(allParticipants.map((p) => p.id)),
						)
							.map((id) =>
								allParticipants.find((p) => p.id === id),
							)
							.filter(
								(item): item is Participant => item !== null,
							),
					})

					onParticipantSubscription(lobby.id)
					onGameSessionSubscription(lobby.id)
					onLobbySubscription(lobby.id)

					return
				}

				const lobbyResponse = await lobbyApi.create({
					code: lobbyCode(),
					isActive: true,
					creatorID: currentUser!.id,
				})

				const lobby = lobbyResponse.item!

				const participantResponse = await participantApi.joinLobby(
					lobby.id,
					currentUser!.id,
				)

				set({
					lobbyCode: lobby.code,
					lobbyID: lobby.id,
					isCreator: true,
					loading: false,
					participants: [participantResponse.item!],
					error: "",
				})

				onParticipantSubscription(lobby.id)
				onGameSessionSubscription(lobby.id)
				onLobbySubscription(lobby.id)
			} catch (error) {
				set({ loading: false, error: error as string })
				console.log("catch", error)
			}
		},

		checkIfUserInLobby: async (p: {
			onFound: (lobby: Lobby) => void
		}): Promise<void> => {
			if (get().loading) return

			set({ loading: true })

			const currentUser = useUserStore.getState().currentUser

			if (currentUser === null) {
				set({ loading: false })

				return
			}

			try {
				const participant = await participantApi.findActiveParticipant(
					currentUser!.id,
				)

				if (!participant.hasData) {
					set({ loading: false })

					return
				}

				const lobby = participant.item!.lobby!

				if (!lobby) {
					set({ loading: false })

					return
				}

				if (!lobby.isActive) {
					set({ loading: false })

					get().leaveLobby()

					return
				}

				p.onFound(lobby)
			} catch (error) {
				set({ loading: false, error: error as string })
				console.log("catch", error)
			}
		},

		joinExistingLobby: async (lobby: Lobby): Promise<void> => {
			try {
				const gameSession = await gameSessionApi.findActiveGameSession(
					lobby.id,
				)

				if (gameSession.hasData) {
					const gameRound = await gameRoundApi.findActiveGameRound(
						gameSession.item!.id,
					)

					if (!gameRound.hasData) return

					const participants = lobby.participants!.items.filter(
						(item): item is Participant => item !== null,
					)

					const allParticipants = [...participants]

					set({
						lobbyCode: lobby.code,
						lobbyID: lobby.id,
						isCreator:
							lobby.creatorID ===
							useUserStore.getState().currentUser!.id,
						gameSessionID: gameSession.item!.id,
						loading: false,
						gameRound: gameRound.hasData ? gameRound.item! : null,
						participants: removeDuplicates(allParticipants),
						error: "",
					})

					onParticipantSubscription(lobby.id)
					onGameSessionSubscription(lobby.id)
					onLobbySubscription(lobby.id)

					router.replace("/friends-mode/")

					return
				}

				return
			} catch (error) {
				set({ loading: false, error: error as string })
				console.log("catch", error)
			}
		},

		joinLobby: async (lobbyCode: string): Promise<void> => {
			if (get().loading) return

			set({ loading: true })

			const currentUser = useUserStore.getState().currentUser

			try {
				const lobbies = await lobbyApi.listByCode(lobbyCode)

				if (!lobbies.hasData || lobbies.items!.length === 0) {
					set({ loading: false, error: "Lobby not found" })

					return
				}

				const lobby = lobbies.items![0]!

				const participants = lobby.participants!.items.filter(
					(item): item is Participant => item !== null,
				)

				let participant = participants.find((participant) => {
					return participant.userId === currentUser!.id
				})

				if (!participant) {
					const response = await participantApi.joinLobby(
						lobby.id,
						currentUser!.id,
					)

					if (response.hasError) {
						set({ loading: false, error: response.error!.message })

						return
					}

					participant = response.item!
				}

				const removeDuplicates = (
					array: Participant[],
				): Participant[] => {
					const ids = new Set()

					return array.filter((item: Participant) => {
						if (!ids.has(item.id)) {
							ids.add(item.id)

							return true
						}

						return false
					})
				}

				const allParticipants = [...participants, participant]

				set({
					lobbyCode: lobby.code,
					lobbyID: lobby.id,
					isCreator: lobby.creatorID === currentUser!.id,
					loading: false,
					participants: removeDuplicates(allParticipants),
					error: "",
				})

				onParticipantSubscription(lobby.id)
				onGameSessionSubscription(lobby.id)
				onLobbySubscription(lobby.id)
			} catch (error) {
				set({ loading: false, error: error as string })
				console.log("catch", error)
			}
		},

		startGame: async (): Promise<void> => {
			if (get().loading) return
			if (!get().lobbyID) return

			if (get().participants.length < 2) {
				set({ loading: false, error: "Not enough participants" })

				return
			}

			set({ loading: true })
			try {
				const response = await gameSessionApi.create({
					lobbyID: get().lobbyID!,
				})

				if (response.hasError) {
					set({ loading: false, error: response.error!.message })

					return
				}

				if (!response.hasData) {
					return
				}

				set({ loading: false, gameSessionID: response.item?.id })
			} catch (error) {
				set({ loading: false, error: error as string })
				console.log("catch", error)
			}
		},

		leaveLobby: async (): Promise<void> => {
			if (get().loading) return
			if (!get().lobbyCode) return

			set({ loading: true })

			if (get().isCreator) {
				return
			}

			const participant = get().participants.find(
				(participant) =>
					participant.userId ===
					useUserStore.getState().currentUser!.id,
			)

			try {
				await participantApi.delete(participant!.id)

				set({
					lobbyCode: null,
					lobbyID: null,
					isCreator: false,
					loading: false,
					participants: [],
				})
			} catch (error) {
				set({ loading: false, error: error as string })
				console.log("catch", error)
			}
		},

		deactivateLobby: async (): Promise<void> => {
			if (participantSubscription) {
				participantSubscription.unsubscribe()
			}

			if (gameSessionSubscription) {
				gameSessionSubscription.unsubscribe()
			}

			if (lobbySubscription) {
				lobbySubscription.unsubscribe()
			}

			if (get().isCreator) {
				await lobbyApi.update({
					id: get().lobbyID!,
					isActive: false,
				})

				const participants = get().participants
				for (let i = 0; i < participants.length; i++) {
					await participantApi.delete(participants[i]!.id)
				}
			}

			set({
				lobbyCode: null,
				lobbyID: null,
				isCreator: false,
				loading: false,
				participants: [],
				gameSessionID: null,
				error: "",
			})
		},
	}
}

export default createLobbySlice

const removeDuplicates = (array: Participant[]): Participant[] => {
	const ids = new Set()

	return array.filter((item: Participant) => {
		if (!ids.has(item.id)) {
			ids.add(item.id)

			return true
		}

		return false
	})
}
