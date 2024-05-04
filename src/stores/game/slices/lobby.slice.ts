import type { StateCreator } from "zustand"

import type { GameStore } from "."
import type { Participant } from "../../../graphql/api"
import type { Subscription } from "../../../types"

import { LobbyApi, ParticipantApi } from "../../../apis"
import useUserStore from "../../../stores/user/useUserStore"

type LobbyStates = {
	lobbyCode: string | null
	participants: Participant[]
	isCreator: boolean
	loading: boolean
	error: string | null
}

type LobbyActions = {
	setIsCreator: (isCreator: boolean) => void
	createLobby: () => Promise<void>
	joinLobby: (lobbyCode: string) => Promise<void>
	leaveLobby: () => Promise<void>
	destroy: () => void
}

export type LobbySlice = LobbyStates & LobbyActions

const createLobbySlice: StateCreator<GameStore, [], [], LobbySlice> = (
	set,
	get,
) => {
	const lobbyApi = new LobbyApi()
	const participantApi = new ParticipantApi()

	let subscription: Subscription | null = null

	const onUpdateSubscription = (lobbyId: string) => {
		subscription = participantApi.subscribe(
			{
				filter: {
					id: { eq: lobbyId },
				},
			},

			({ type, data: participant }) => {
				console.log("====Subscription====\n")
				console.log(type, participant)
				console.log("====Subscription====\n")
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

		return subscription
	}

	return {
		lobbyCode: null,
		participants: [],
		isCreator: false,
		loading: false,
		error: null,

		setIsCreator: (isCreator) => {
			set({ isCreator })
		},

		createLobby: async (): Promise<void> => {
			if (get().loading) return
			const currentUser = useUserStore.getState().currentUser

			set({ loading: true })

			const lobbyCode = (): string => {
				const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
				let code = ""

				for (let i = 0; i < 8; i++) {
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
						isCreator: true,
						loading: false,
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

					onUpdateSubscription(lobby.id)

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
					isCreator: true,
					loading: false,
					participants: [participantResponse.item!],
				})

				onUpdateSubscription(lobby.id)
			} catch (error) {
				set({ loading: false, error: error as string })
				console.log("catch", error)
			}
		},

		joinLobby: async (lobbyCode): Promise<void> => {
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

				console.log("====Found lobby====lobby", lobby)

				const participants = lobby.participants!.items.filter(
					(item): item is Participant => item !== null,
				)
				console.log("====Found lobby====participants", participants)

				let participant = participants.find((participant) => {
					return participant.userId === currentUser!.id
				})

				console.log(
					"---Checking participant---participant",
					participant,
				)

				if (!participant) {
					const response = await participantApi.joinLobby(
						lobby.id,
						currentUser!.id,
					)

					console.log("====Joining====participant", response)

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

				console.log("====Joining====allParticipants", allParticipants)

				set({
					lobbyCode: lobby.code,
					isCreator: false,
					loading: false,
					participants: removeDuplicates(allParticipants),
				})

				onUpdateSubscription(lobby.id)
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
					isCreator: false,
					loading: false,
					participants: [],
				})
			} catch (error) {
				set({ loading: false, error: error as string })
				console.log("catch", error)
			}
		},

		destroy: () => {
			if (subscription) {
				subscription.unsubscribe()
			}
		},
	}
}

export default createLobbySlice
