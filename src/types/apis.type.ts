import type {
	CreateGameRoundInput,
	CreateGameSessionInput,
	CreateLobbyInput,
	CreateSubmittedAnswerInput,
	GameRound,
	GameSession,
	Lobby,
	ModelGameRoundFilterInput,
	ModelGameSessionFilterInput,
	ModelLobbyFilterInput,
	ModelParticipantFilterInput,
	ModelSubmittedAnswerFilterInput,
	ModelUserFilterInput,
	Participant,
	SubmittedAnswer,
	UpdateGameRoundInput,
	UpdateLobbyInput,
	UpdateUserInput,
	User,
} from "../graphql/api"
import type {
	ItemResponse,
	ListByIdQueryParams,
	ListQueryParams,
	ListResponse,
	SubscriptionParams,
	SubscriptionResponse,
} from "./helpers.type"

export type CompleteApi<C, U, T, P> = QueryApi<T, P> &
	MutationApi<C, U, T> &
	SubscriptionApi<T, P>

export type CreateMutationApi<C, T> = {
	create(input: C): Promise<ItemResponse<T>>
}

export type CreateWithImageMutationApi<T> = {
	create(input: T, image: File): Promise<ItemResponse<T>>
}

export type DeleteMutationApi<T> = {
	delete(id: string): Promise<ItemResponse<T>>
}

export type GetQueryApi<T> = {
	get(id: string): Promise<ItemResponse<T>>
}

export type IGameRoundApi = CreateMutationApi<CreateGameRoundInput, GameRound> &
	UpdateMutationApi<UpdateGameRoundInput, GameRound> &
	SubscriptionApi<GameRound, ModelGameRoundFilterInput | null | undefined> & {
		findActiveGameRound(
			gameSessionID: string,
		): Promise<ItemResponse<GameRound>>
	}

export type IGameSessionApi = ListByIdQueryApi<
	GameSession,
	ModelGameSessionFilterInput | null | undefined
> &
	CreateMutationApi<CreateGameSessionInput, GameSession> &
	SubscriptionApi<
		GameSession,
		ModelGameSessionFilterInput | null | undefined
	> & {
		findActiveGameSession(
			lobbyID: string,
		): Promise<ItemResponse<GameSession>>
	}

export type ILobbyApi = CreateMutationApi<CreateLobbyInput, Lobby> &
	UpdateMutationApi<UpdateLobbyInput, Lobby> &
	ListByIdQueryApi<Lobby, ModelLobbyFilterInput | null | undefined> & {
		listByCode(code: string): Promise<ListResponse<Lobby>>
	}

export type IParticipantApi = ListByIdQueryApi<
	Participant,
	ModelParticipantFilterInput | null | undefined
> &
	DeleteMutationApi<Participant> &
	SubscriptionApi<
		Participant,
		ModelParticipantFilterInput | null | undefined
	> & {
		findActiveParticipant(
			userID: string,
		): Promise<ItemResponse<Participant>>
		joinLobby(
			lobbyID: string,
			userID: string,
		): Promise<ItemResponse<Participant>>
	}
export type ISubmittedAnswer = CreateMutationApi<
	CreateSubmittedAnswerInput,
	SubmittedAnswer
> &
	SubscriptionApi<
		SubmittedAnswer,
		ModelSubmittedAnswerFilterInput | null | undefined
	> & {
		listByGameSessionID(
			gameSessionID: string,
		): Promise<ItemResponse<SubmittedAnswer[]>>
	}

export type IUserApi = QueryApi<User, ModelUserFilterInput | null | undefined> &
	UpdateWithImageMutationApi<UpdateUserInput, User>

export type ListByIdQueryApi<T, P> = {
	listById(params: ListByIdQueryParams<P>): Promise<ListResponse<T>>
}

export type ListQueryApi<T, P> = {
	list(params: ListQueryParams<P>): Promise<ListResponse<T>>
}

export type MutationApi<C, U, T> = CreateMutationApi<C, T> &
	UpdateMutationApi<U, T> &
	DeleteMutationApi<T>

export type QueryApi<T, P> = GetQueryApi<T> & ListQueryApi<T, P>

export type SubscriptionApi<T, P> = {
	subscribe(
		params: SubscriptionParams<P>,
		onResponse: (response: SubscriptionResponse<T>) => void,
	): { unsubscribe: () => void }
}

export type UpdateMutationApi<U, T> = {
	update(input: U): Promise<ItemResponse<T>>
}

export type UpdateWithImageMutationApi<U, T> = {
	update(input: U, image?: File | null): Promise<ItemResponse<T>>
}
