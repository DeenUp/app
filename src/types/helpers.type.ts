export type ApiRequestType = "Public" | "Private"

export type ApiResponse = {
	error?: Error | null
	hasError: boolean
	hasData: boolean
}

export type ItemResponse<T> = ApiResponse & {
	item?: T | null
}

export type ListResponse<T> = ApiResponse & {
	items?: (T | null)[] | null
	nextToken?: string | null
}

export type SubscriptionResponse<T> = {
	type: "created" | "updated" | "deleted"
	data: T
}

export type Success<T> = {
	value: T
}

export type Fail = {
	error: Error
}

export type Maybe<T> = Success<T> | Fail

export type ListQueryParams<T> = {
	filter?: T
	limit?: number
	nextToken?: string
}

export type ListByIdQueryParams<T> = {
	id: string
	filter?: T
	limit?: number
	nextToken?: string
}

export type SubscriptionParams<T> = {
	filter: T
}

export type Subscription = { unsubscribe: () => void }

export type GraphqlSubscriptionMessage<T> = {
	data: T
}
