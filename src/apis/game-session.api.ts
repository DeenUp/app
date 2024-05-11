import type { GraphQLResult } from "aws-amplify/api"
import type { Observable } from "rxjs"

import {
	createGameSession,
	deleteGameSession,
	updateGameSession,
} from "~graphql/mutations"
import { getGameSession, listGameSessions } from "~graphql/queries"
import { onCreateGameSession } from "~graphql/subscriptions"
import { AmplifyGraphqlService } from "~services/index"

import type {
	CreateGameSessionInput,
	CreateGameSessionMutation,
	CreateGameSessionMutationVariables,
	DeleteGameSessionMutation,
	DeleteGameSessionMutationVariables,
	GameSession,
	GetGameSessionQuery,
	GetGameSessionQueryVariables,
	ListGameSessionsQuery,
	ListGameSessionsQueryVariables,
	ModelGameSessionConnection,
	ModelGameSessionFilterInput,
	OnCreateGameSessionSubscription,
	OnCreateGameSessionSubscriptionVariables,
	UpdateGameSessionInput,
	UpdateGameSessionMutation,
	UpdateGameSessionMutationVariables,
} from "~graphql/api"
import type {
	CompleteApi,
	GraphQLService,
	GraphqlSubscriptionMessage,
	ItemResponse,
	ListQueryParams,
	ListResponse,
	NeverEmpty,
	Subscription,
	SubscriptionParams,
	SubscriptionResponse,
} from "~types/index"

export default class GameSessionApi
	implements
		CompleteApi<
			CreateGameSessionInput,
			UpdateGameSessionInput,
			GameSession,
			ModelGameSessionFilterInput | null | undefined
		>
{
	private readonly graphqlService: GraphQLService

	constructor(graphqlService?: GraphQLService) {
		this.graphqlService = graphqlService ?? new AmplifyGraphqlService()
	}

	subscribe(
		params: SubscriptionParams<
			ModelGameSessionFilterInput | null | undefined
		>,
		onResponse: (response: SubscriptionResponse<GameSession>) => void,
	): Subscription {
		const createStream = this.graphqlService
			.subscribe<
				typeof onCreateGameSession,
				OnCreateGameSessionSubscriptionVariables,
				Observable<
					GraphqlSubscriptionMessage<
						NeverEmpty<OnCreateGameSessionSubscription>
					>
				>
			>(onCreateGameSession, {})
			.subscribe({
				next: ({ data }) => {
					console.log("Created GameSession")
					onResponse({
						type: "created",
						data: data.onCreateGameSession as GameSession,
					})
				},
				error: (error) => {
					console.error("Error subscribing to participants", error)
				},
			})

		return {
			unsubscribe: () => {
				createStream.unsubscribe()
			},
		}
	}

	async get(id: string): Promise<ItemResponse<GameSession>> {
		const response = await this.graphqlService.query<
			typeof getGameSession,
			GetGameSessionQueryVariables,
			GraphQLResult<GetGameSessionQuery>
		>(getGameSession, {
			id,
		})

		if (response.errors) {
			return {
				error: new Error(response.errors[0]!.message),
				hasError: true,
				hasData: false,
			}
		}

		const gameSession = response.data.getGameSession as GameSession | null

		return {
			hasError: false,
			hasData: gameSession !== null,
			item: gameSession,
		}
	}

	async list(
		params: ListQueryParams<ModelGameSessionFilterInput | null | undefined>,
	): Promise<ListResponse<GameSession>> {
		const response = await this.graphqlService.query<
			typeof listGameSessions,
			ListGameSessionsQueryVariables,
			GraphQLResult<ListGameSessionsQuery>
		>(listGameSessions, {
			limit: params.limit,
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
			.listGameSessions as ModelGameSessionConnection

		return {
			hasError: false,
			hasData: true,
			items: connection.items as GameSession[],
			nextToken: connection.nextToken,
		}
	}

	async create(
		input: CreateGameSessionInput,
	): Promise<ItemResponse<GameSession>> {
		const response = await this.graphqlService.mutate<
			typeof createGameSession,
			CreateGameSessionMutationVariables,
			GraphQLResult<CreateGameSessionMutation>
		>(createGameSession, {
			input: input,
		})

		if (response.errors) {
			return {
				error: new Error(response.errors[0]!.message),
				hasError: true,
				hasData: false,
			}
		}

		const createdGameSession = response.data
			.createGameSession as GameSession

		return {
			hasError: false,
			hasData: true,
			item: createdGameSession,
		}
	}

	async update(input: GameSession): Promise<ItemResponse<GameSession>> {
		const response = await this.graphqlService.mutate<
			typeof updateGameSession,
			UpdateGameSessionMutationVariables,
			GraphQLResult<UpdateGameSessionMutation>
		>(updateGameSession, {
			input: input,
		})

		if (response.errors) {
			return {
				error: new Error(response.errors[0]!.message),
				hasError: true,
				hasData: false,
			}
		}

		const updatedGameSession = response.data
			.updateGameSession as GameSession

		return {
			hasError: false,
			hasData: true,
			item: updatedGameSession,
		}
	}

	async delete(id: string): Promise<ItemResponse<GameSession>> {
		const response = await this.graphqlService.mutate<
			typeof deleteGameSession,
			DeleteGameSessionMutationVariables,
			GraphQLResult<DeleteGameSessionMutation>
		>(deleteGameSession, {
			input: { id },
		})

		if (response.errors) {
			return {
				error: new Error(response.errors[0]!.message),
				hasError: true,
				hasData: false,
			}
		}

		const deletedGameSession = response.data
			.deleteGameSession as GameSession

		return {
			hasError: false,
			hasData: true,
			item: deletedGameSession,
		}
	}
}
