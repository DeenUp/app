import type { GraphQLResult } from "aws-amplify/api"
import type { Observable } from "rxjs"

import type {
	CreateLobbyInput,
	CreateLobbyMutation,
	CreateLobbyMutationVariables,
	ListLobbiesByCodeQuery,
	ListLobbiesByCodeQueryVariables,
	ListLobbiesByCreatorIDQuery,
	ListLobbiesByCreatorIDQueryVariables,
	Lobby,
	ModelLobbyConnection,
	ModelLobbyFilterInput,
	OnUpdateLobbySubscription,
	OnUpdateLobbySubscriptionVariables,
	UpdateLobbyInput,
	UpdateLobbyMutation,
	UpdateLobbyMutationVariables,
} from "../graphql/api"
import type {
	GraphQLService,
	GraphqlSubscriptionMessage,
	ILobbyApi,
	ItemResponse,
	ListByIdQueryParams,
	ListResponse,
	NeverEmpty,
	Subscription,
	SubscriptionParams,
	SubscriptionResponse,
} from "../types"

import { createLobby, updateLobby } from "../graphql/mutations"
import { listLobbiesByCode, listLobbiesByCreatorID } from "../graphql/queries"
import { onUpdateLobby } from "../graphql/subscriptions"
import { AmplifyGraphqlService } from "../services"

export default class LobbyApi implements ILobbyApi {
	private readonly graphqlService: GraphQLService

	constructor(graphqlService?: GraphQLService) {
		this.graphqlService = graphqlService ?? new AmplifyGraphqlService()
	}

	async listByCode(code: string): Promise<ListResponse<Lobby>> {
		const response = await this.graphqlService.query<
			typeof listLobbiesByCode,
			ListLobbiesByCodeQueryVariables,
			GraphQLResult<ListLobbiesByCodeQuery>
		>(listLobbiesByCode, {
			code: code,
			filter: {
				isActive: {
					eq: true,
				},
			},
		})

		if (response.errors) {
			return {
				error: new Error(response.errors[0]!.message),
				hasError: true,
				hasData: false,
			}
		}

		const connection = response.data
			.listLobbiesByCode as ModelLobbyConnection

		return {
			hasError: false,
			hasData: true,
			items: connection.items,
			nextToken: connection.nextToken,
		}
	}

	async create(input: CreateLobbyInput): Promise<ItemResponse<Lobby>> {
		const response = await this.graphqlService.mutate<
			typeof createLobby,
			CreateLobbyMutationVariables,
			GraphQLResult<CreateLobbyMutation>
		>(createLobby, {
			input: input,
		})

		if (response.errors) {
			return {
				error: new Error(response.errors[0]!.message),
				hasError: true,
				hasData: false,
			}
		}

		const createdLobby = response.data.createLobby as Lobby

		return {
			hasError: false,
			hasData: true,
			item: createdLobby,
		}
	}

	async update(input: UpdateLobbyInput): Promise<ItemResponse<Lobby>> {
		const response = await this.graphqlService.mutate<
			typeof updateLobby,
			UpdateLobbyMutationVariables,
			GraphQLResult<UpdateLobbyMutation>
		>(updateLobby, {
			input: {
				id: input.id,
				isActive: input.isActive,
			},
		})

		if (response.errors) {
			return {
				error: new Error(response.errors[0]!.message),
				hasError: true,
				hasData: false,
			}
		}

		const updatedLobby = response.data.updateLobby as Lobby

		return {
			hasError: false,
			hasData: true,
			item: updatedLobby,
		}
	}

	async listById(
		params: ListByIdQueryParams<ModelLobbyFilterInput | null | undefined>,
	): Promise<ListResponse<Lobby>> {
		const response = await this.graphqlService.query<
			typeof listLobbiesByCreatorID,
			ListLobbiesByCreatorIDQueryVariables,
			GraphQLResult<ListLobbiesByCreatorIDQuery>
		>(listLobbiesByCreatorID, {
			creatorID: params.id,
			filter: params.filter,
			limit: params.limit ?? 10,
			nextToken: params.nextToken,
		})

		if (response.errors) {
			return {
				error: new Error(response.errors[0]!.message),
				hasError: true,
				hasData: false,
			}
		}

		const connection = response.data
			.listLobbiesByCreatorID as ModelLobbyConnection

		return {
			hasError: false,
			hasData: true,
			items: connection.items,
			nextToken: connection.nextToken,
		}
	}

	subscribe(
		params: SubscriptionParams<ModelLobbyFilterInput | null | undefined>,
		onResponse: (response: SubscriptionResponse<Lobby>) => void,
	): Subscription {
		const updateStream = this.graphqlService
			.subscribe<
				typeof onUpdateLobby,
				OnUpdateLobbySubscriptionVariables,
				Observable<
					GraphqlSubscriptionMessage<
						NeverEmpty<OnUpdateLobbySubscription>
					>
				>
			>(onUpdateLobby, {
				filter: params.filter,
			})
			.subscribe({
				next: ({ data }) => {
					onResponse({
						type: "updated",
						data: data.onUpdateLobby as Lobby,
					})
				},
				error: (error) => {
					console.error("Error in lobby subscription", error)
				},
			})

		return {
			unsubscribe: () => {
				updateStream.unsubscribe()
			},
		}
	}
}
