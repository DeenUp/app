import type {
	GameSession,
	Lobby,
	ModelGameSessionFilterInput,
	ModelLobbyFilterInput,
	ModelParticipantFilterInput,
	ModelUserFilterInput,
	Participant,
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

export type GetQueryApi<T> = {
	get(id: string): Promise<ItemResponse<T>>
}

export type ListQueryApi<T, P> = {
	list(params: ListQueryParams<P>): Promise<ListResponse<T>>
}

export type ListByIdQueryApi<T, P> = {
	listById(params: ListByIdQueryParams<P>): Promise<ListResponse<T>>
}

export type CreateMutationApi<T> = {
	create(input: T): Promise<ItemResponse<T>>
}

export type CreateWithImageMutationApi<T> = {
	create(input: T, image: File): Promise<ItemResponse<T>>
}

export type UpdateMutationApi<T> = {
	update(input: T): Promise<ItemResponse<T>>
}

export type UpdateWithImageMutationApi<T> = {
	update(input: T, image?: File | null): Promise<ItemResponse<T>>
}

export type DeleteMutationApi<T> = {
	delete(id: string): Promise<ItemResponse<T>>
}

export type SubscriptionApi<T, P> = {
	subscribe(
		params: SubscriptionParams<P>,
		onResponse: (response: SubscriptionResponse<T>) => void,
	): { unsubscribe: () => void }
}

export type QueryApi<T, P> = GetQueryApi<T> & ListQueryApi<T, P>

export type MutationApi<T> = CreateMutationApi<T> &
	UpdateMutationApi<T> &
	DeleteMutationApi<T>

export type CompleteApi<T, P> = QueryApi<T, P> &
	MutationApi<T> &
	SubscriptionApi<T, P>

export type IGameSessionApi = ListByIdQueryApi<
	GameSession,
	ModelGameSessionFilterInput | null | undefined
> &
	CreateMutationApi<GameSession> &
	SubscriptionApi<GameSession, ModelGameSessionFilterInput | null | undefined>

export type ILobbyApi = CreateMutationApi<Lobby> &
	UpdateMutationApi<Lobby> &
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
		joinLobby(
			lobbyId: string,
			userId: string,
		): Promise<ItemResponse<Participant>>
	}

export type IUserApi = QueryApi<User, ModelUserFilterInput | null | undefined> &
	UpdateWithImageMutationApi<User>
