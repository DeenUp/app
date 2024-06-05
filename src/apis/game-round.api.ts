import type { GraphQLResult } from "aws-amplify/api"
import type { Observable } from "rxjs"

import type {
	CreateGameRoundInput,
	CreateGameRoundMutation,
	CreateGameRoundMutationVariables,
	GameRound,
	ModelGameRoundFilterInput,
	OnCreateGameRoundSubscription,
	OnCreateGameRoundSubscriptionVariables,
	OnUpdateGameRoundSubscription,
	OnUpdateGameRoundSubscriptionVariables,
	UpdateGameRoundInput,
	UpdateGameRoundMutation,
	UpdateGameRoundMutationVariables,
} from "~/graphql/api"
import type {
	GraphQLService,
	GraphqlSubscriptionMessage,
	IGameRoundApi,
	ItemResponse,
	NeverEmpty,
	Subscription,
	SubscriptionParams,
	SubscriptionResponse,
} from "~types/index"

import { createGameRound, updateGameRound } from "~/graphql/mutations"
import { onCreateGameRound, onUpdateGameRound } from "~/graphql/subscriptions"
import { AmplifyGraphqlService } from "~/services"

export default class GameRoundApi implements IGameRoundApi {
	private readonly graphqlService: GraphQLService

	constructor(graphqlService?: GraphQLService) {
		this.graphqlService = graphqlService ?? new AmplifyGraphqlService()
	}

	async create(
		input: CreateGameRoundInput,
	): Promise<ItemResponse<GameRound>> {
		const response = await this.graphqlService.mutate<
			typeof createGameRound,
			CreateGameRoundMutationVariables,
			GraphQLResult<CreateGameRoundMutation>
		>(createGameRound, {
			input,
		})

		if (response.errors) {
			return {
				error: new Error(response.errors[0]!.message),
				hasError: true,
				hasData: false,
			}
		}

		const createdGameRound = response.data.createGameRound as GameRound

		return {
			hasError: false,
			hasData: true,
			item: createdGameRound,
		}
	}

	async update(
		input: UpdateGameRoundInput,
	): Promise<ItemResponse<GameRound>> {
		const response = await this.graphqlService.mutate<
			typeof updateGameRound,
			UpdateGameRoundMutationVariables,
			GraphQLResult<UpdateGameRoundMutation>
		>(updateGameRound, {
			input: input,
		})

		if (response.errors) {
			return {
				error: new Error(response.errors[0]!.message),
				hasError: true,
				hasData: false,
			}
		}

		const updatedGameRound = response.data.updateGameRound as GameRound

		return {
			hasError: false,
			hasData: true,
			item: updatedGameRound,
		}
	}

	subscribe(
		params: SubscriptionParams<
			ModelGameRoundFilterInput | null | undefined
		>,
		onResponse: (response: SubscriptionResponse<GameRound>) => void,
	): Subscription {
		const createStream = this.graphqlService
			.subscribe<
				typeof onCreateGameRound,
				OnCreateGameRoundSubscriptionVariables,
				Observable<
					GraphqlSubscriptionMessage<
						NeverEmpty<OnCreateGameRoundSubscription>
					>
				>
			>(onCreateGameRound, params)
			.subscribe({
				next: ({ data }) => {
					onResponse({
						type: "created",
						data: data.onCreateGameRound as GameRound,
					})
				},
				error: (error) => {
					console.error("Error subscribing to game round", error)
				},
			})

		const updateStream = this.graphqlService
			.subscribe<
				typeof onUpdateGameRound,
				OnUpdateGameRoundSubscriptionVariables,
				Observable<
					GraphqlSubscriptionMessage<
						NeverEmpty<OnUpdateGameRoundSubscription>
					>
				>
			>(onUpdateGameRound, params)
			.subscribe({
				next: ({ data }) => {
					onResponse({
						type: "updated",
						data: data.onUpdateGameRound as GameRound,
					})
				},
				error: (error) => {
					console.error("Error subscribing to GameRounds", error)
				},
			})

		return {
			unsubscribe: () => {
				createStream.unsubscribe()
				updateStream.unsubscribe()
			},
		}
	}
}
