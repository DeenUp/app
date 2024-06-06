import type { GraphQLResult } from "aws-amplify/api"
import type { Observable } from "rxjs"

import type {
	CreateSubmittedAnswerInput,
	CreateSubmittedAnswerMutation,
	CreateSubmittedAnswerMutationVariables,
	ListSubmittedAnswersByGameSessionIDQuery,
	ListSubmittedAnswersByGameSessionIDQueryVariables,
	ModelSubmittedAnswerConnection,
	ModelSubmittedAnswerFilterInput,
	OnCreateSubmittedAnswerSubscription,
	OnCreateSubmittedAnswerSubscriptionVariables,
	SubmittedAnswer,
} from "~/graphql/api"
import type {
	GraphQLService,
	GraphqlSubscriptionMessage,
	ISubmittedAnswer,
	ItemResponse,
	NeverEmpty,
	Subscription,
	SubscriptionParams,
	SubscriptionResponse,
} from "~/types"

import { createSubmittedAnswer } from "~/graphql/mutations"
import { listSubmittedAnswersByGameSessionID } from "~/graphql/queries"
import { onCreateSubmittedAnswer } from "~/graphql/subscriptions"
import { AmplifyGraphqlService } from "~/services"

export default class SubmittedAnswerApi implements ISubmittedAnswer {
	private readonly graphqlService: GraphQLService

	constructor(graphqlService?: GraphQLService) {
		this.graphqlService = graphqlService ?? new AmplifyGraphqlService()
	}

	async create(
		input: CreateSubmittedAnswerInput,
	): Promise<ItemResponse<SubmittedAnswer>> {
		const response = await this.graphqlService.mutate<
			typeof createSubmittedAnswer,
			CreateSubmittedAnswerMutationVariables,
			GraphQLResult<CreateSubmittedAnswerMutation>
		>(createSubmittedAnswer, {
			input,
		})

		if (response.errors) {
			return {
				error: new Error(response.errors[0]!.message),
				hasError: true,
				hasData: false,
			}
		}

		const createdSubmittedAnswer = response.data
			.createSubmittedAnswer as SubmittedAnswer

		return {
			hasError: false,
			hasData: true,
			item: createdSubmittedAnswer,
		}
	}

	subscribe(
		params: SubscriptionParams<
			ModelSubmittedAnswerFilterInput | null | undefined
		>,
		onResponse: (response: SubscriptionResponse<SubmittedAnswer>) => void,
	): Subscription {
		const createStream = this.graphqlService
			.subscribe<
				typeof onCreateSubmittedAnswer,
				OnCreateSubmittedAnswerSubscriptionVariables,
				Observable<
					GraphqlSubscriptionMessage<
						NeverEmpty<OnCreateSubmittedAnswerSubscription>
					>
				>
			>(onCreateSubmittedAnswer, params)
			.subscribe({
				next: ({ data }) => {
					onResponse({
						type: "created",
						data: data.onCreateSubmittedAnswer as SubmittedAnswer,
					})
				},
				error: (error) => {
					console.error(
						"Error subscribing to submitted answers",
						error,
					)
				},
			})

		return {
			unsubscribe: () => {
				createStream.unsubscribe()
			},
		}
	}

	async listByGameSessionID(
		gameSessionID: string,
	): Promise<ItemResponse<SubmittedAnswer[]>> {
		const response = await this.graphqlService.query<
			typeof listSubmittedAnswersByGameSessionID,
			ListSubmittedAnswersByGameSessionIDQueryVariables,
			GraphQLResult<ListSubmittedAnswersByGameSessionIDQuery>
		>(listSubmittedAnswersByGameSessionID, { gameSessionID })

		if (response.errors) {
			return {
				error: new Error(response.errors[0]!.message),
				hasError: true,
				hasData: false,
			}
		}

		const connection = response.data
			.listSubmittedAnswersByGameSessionID as ModelSubmittedAnswerConnection

		if (!connection.items.length) {
			return {
				hasError: false,
				hasData: false,
			}
		}

		return {
			hasError: false,
			hasData: true,
			item: connection.items as SubmittedAnswer[],
		}
	}
}
