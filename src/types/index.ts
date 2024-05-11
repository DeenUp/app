import type { GraphqlSubscriptionMessage, NeverEmpty } from "./amplify.type"
import type {
	CompleteApi,
	CreateMutationApi,
	CreateWithImageMutationApi,
	DeleteMutationApi,
	GetQueryApi,
	IGameRoundApi,
	IGameSessionApi,
	ILobbyApi,
	IParticipantApi,
	ISubmittedAnswer,
	IUserApi,
	ListByIdQueryApi,
	ListQueryApi,
	MutationApi,
	QueryApi,
	SubscriptionApi,
	UpdateMutationApi,
	UpdateWithImageMutationApi,
} from "./apis.type"
import type { Player, PossibleAnswer, Question } from "./game.type"
import type {
	ApiRequestType,
	ApiResponse,
	Fail,
	ItemResponse,
	ListByIdQueryParams,
	ListQueryParams,
	ListResponse,
	Maybe,
	Subscription,
	SubscriptionParams,
	SubscriptionResponse,
	Success,
} from "./helpers.type"
import type {
	AnalyticsService,
	GraphQLService,
	RestService,
	StorageService,
} from "./services.type"

export type {
	AnalyticsService,
	ApiRequestType,
	ApiResponse,
	CompleteApi,
	CreateMutationApi,
	CreateWithImageMutationApi,
	DeleteMutationApi,
	Fail,
	GetQueryApi,
	GraphQLService,
	GraphqlSubscriptionMessage,
	IGameRoundApi,
	IGameSessionApi,
	ILobbyApi,
	IParticipantApi,
	ISubmittedAnswer,
	IUserApi,
	ItemResponse,
	ListByIdQueryApi,
	ListByIdQueryParams,
	ListQueryApi,
	ListQueryParams,
	ListResponse,
	Maybe,
	MutationApi,
	NeverEmpty,
	Player,
	PossibleAnswer,
	QueryApi,
	Question,
	RestService,
	StorageService,
	Subscription,
	SubscriptionApi,
	SubscriptionParams,
	SubscriptionResponse,
	Success,
	UpdateMutationApi,
	UpdateWithImageMutationApi,
}

export type Theme = {
	colors: {
		primary: string
		background: string
		surface: string
		accent: string
		// Add more colors as needed
	}
	// Add more theme properties as needed
}
