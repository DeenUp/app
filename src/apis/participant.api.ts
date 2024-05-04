import type { GraphQLResult } from "aws-amplify/api"
import type { Observable } from "rxjs"

import type {
	CreateParticipantMutation,
	CreateParticipantMutationVariables,
	DeleteParticipantMutation,
	DeleteParticipantMutationVariables,
	ModelParticipantConnection,
	ModelParticipantFilterInput,
	OnCreateParticipantSubscription,
	OnCreateParticipantSubscriptionVariables,
	OnDeleteParticipantSubscription,
	OnDeleteParticipantSubscriptionVariables,
	OnUpdateParticipantSubscription,
	OnUpdateParticipantSubscriptionVariables,
	Participant,
	ParticipantsByLobbyIdQuery,
	ParticipantsByLobbyIdQueryVariables,
} from "../graphql/api"
import type {
	GraphQLService,
	GraphqlSubscriptionMessage,
	IParticipantApi,
	ItemResponse,
	ListByIdQueryParams,
	ListResponse,
	NeverEmpty,
	SubscriptionParams,
	SubscriptionResponse,
} from "../types"

import { createParticipant, deleteParticipant } from "../graphql/mutations"
import { participantsByLobbyId } from "../graphql/queries"
import {
	onCreateParticipant,
	onDeleteParticipant,
	onUpdateParticipant,
} from "../graphql/subscriptions"
import { AmplifyGraphqlService } from "../services"

export default class ParticipantApi implements IParticipantApi {
	private readonly graphqlService: GraphQLService

	constructor(graphqlService?: GraphQLService) {
		this.graphqlService = graphqlService ?? new AmplifyGraphqlService()
	}

	async listById(
		params: ListByIdQueryParams<
			ModelParticipantFilterInput | null | undefined
		>,
	): Promise<ListResponse<Participant>> {
		const response = await this.graphqlService.query<
			typeof participantsByLobbyId,
			ParticipantsByLobbyIdQueryVariables,
			GraphQLResult<ParticipantsByLobbyIdQuery>
		>(participantsByLobbyId, {
			lobbyId: params.id,
			filter: params.filter,
		})

		if (response.errors) {
			return {
				error: new Error(response.errors[0]!.message),
				hasError: true,
				hasData: false,
			}
		}

		const connection = response.data
			.participantsByLobbyId as ModelParticipantConnection

		return {
			hasError: false,
			hasData: connection.items.length > 0,
			items: connection.items,
			nextToken: connection.nextToken,
		}
	}

	async delete(id: string): Promise<ItemResponse<Participant>> {
		const response = await this.graphqlService.mutate<
			typeof deleteParticipant,
			DeleteParticipantMutationVariables,
			GraphQLResult<DeleteParticipantMutation>
		>(deleteParticipant, {
			input: {
				id,
			},
		})

		if (response.errors) {
			return {
				error: new Error(response.errors[0]!.message),
				hasError: true,
				hasData: false,
			}
		}

		const deletedParticipant = response.data
			.deleteParticipant as Participant

		return {
			hasError: false,
			hasData: true,
			item: deletedParticipant,
		}
	}

	subscribe(
		params: SubscriptionParams<
			ModelParticipantFilterInput | null | undefined
		>,
		onResponse: (response: SubscriptionResponse<Participant>) => void,
	): { unsubscribe: () => void } {
		const createStream = this.graphqlService
			.subscribe<
				typeof onCreateParticipant,
				OnCreateParticipantSubscriptionVariables,
				Observable<
					GraphqlSubscriptionMessage<
						NeverEmpty<OnCreateParticipantSubscription>
					>
				>
			>(onCreateParticipant, {})
			.subscribe({
				next: ({ data }) => {
					console.log("Created participant")
					onResponse({
						type: "created",
						data: data.onCreateParticipant as Participant,
					})
				},
				error: (error) => {
					console.error("Error subscribing to participants", error)
				},
			})

		const updateStream = this.graphqlService
			.subscribe<
				typeof onUpdateParticipant,
				OnUpdateParticipantSubscriptionVariables,
				Observable<
					GraphqlSubscriptionMessage<
						NeverEmpty<OnUpdateParticipantSubscription>
					>
				>
			>(onUpdateParticipant, {})
			.subscribe({
				next: ({ data }) => {
					console.log("Updated participant")
					onResponse({
						type: "updated",
						data: data.onUpdateParticipant as Participant,
					})
				},
				error: (error) => {
					console.error("Error subscribing to participants", error)
				},
			})

		const deleteStream = this.graphqlService
			.subscribe<
				typeof onDeleteParticipant,
				OnDeleteParticipantSubscriptionVariables,
				Observable<
					GraphqlSubscriptionMessage<
						NeverEmpty<OnDeleteParticipantSubscription>
					>
				>
			>(onDeleteParticipant, {})
			.subscribe({
				next: ({ data }) => {
					console.log("Deleted participant")
					onResponse({
						type: "deleted",
						data: data.onDeleteParticipant as Participant,
					})
				},
				error: (error) => {
					console.error("Error subscribing to participants", error)
				},
			})

		return {
			unsubscribe: () => {
				createStream.unsubscribe()
				updateStream.unsubscribe()
				deleteStream.unsubscribe()
			},
		}
	}

	async joinLobby(
		lobbyId: string,
		userId: string,
	): Promise<ItemResponse<Participant>> {
		const response = await this.graphqlService.mutate<
			typeof createParticipant,
			CreateParticipantMutationVariables,
			GraphQLResult<CreateParticipantMutation>
		>(createParticipant, {
			input: {
				lobbyId,
				userId,
			},
		})

		if (response.errors) {
			return {
				error: new Error(response.errors[0]!.message),
				hasError: true,
				hasData: false,
			}
		}

		const createdParticipant = response.data
			.createParticipant as Participant

		return {
			hasError: false,
			hasData: true,
			item: createdParticipant,
		}
	}
}
