import type { AmplifyClassV6, ResourcesConfig } from "@aws-amplify/core"
import type {
	DocumentType,
	GraphQLAuthMode,
} from "@aws-amplify/core/internals/utils"
import type { DocumentNode, GraphQLError, Source } from "graphql"
import type { Observable } from "rxjs"

/**
 * Loose/Unknown options for raw GraphQLAPICategory `graphql()`.
 */
export type GraphQLOptions = {
	query: string | DocumentNode
	variables?: Record<string, DocumentType>
	authMode?: GraphQLAuthMode
	authToken?: string
	/**
	 * @deprecated This property should not be used
	 */
	userAgentSuffix?: string
}

export type GraphQLResult<T = object | null> = {
	data: T
	errors?: GraphQLError[]
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	extensions?: Record<string, any>
}

// Opaque type used for determining the graphql query type
declare const queryType: unique symbol

export type GraphQLQuery<T> = T & { readonly [queryType]: "query" }
export type GraphQLSubscription<T> = T & {
	readonly [queryType]: "subscription"
}

export type GraphQLReturnType<T> =
	T extends Record<string, unknown>
		? {
				[K in keyof T]?: GraphQLReturnType<T[K]>
			}
		: T

/**
 * Describes a paged list result from AppSync, which can either
 * live at the top query or property (e.g., related model) level.
 */
type PagedList<T, TYPENAME> = {
	__typename: TYPENAME
	nextToken?: string | null | undefined
	items: T[]
}

/**
 * Recursively looks through a result type and removes nulls and
 * and undefined from `PagedList` types.
 *
 * Although a graphql response might contain empty values in an
 * array, this will only be the case when we also have errors,
 * which will then be *thrown*.
 */
type WithListsFixed<T> =
	T extends PagedList<infer IT, infer NAME>
		? PagedList<Exclude<IT, null | undefined>, NAME>
		: T extends Record<string, unknown>
			? {
					[K in keyof T]: WithListsFixed<T[K]>
				}
			: T

/**
 * Returns an updated response type to always return a value.
 */
export type NeverEmpty<T> = {
	[K in keyof T]-?: Exclude<WithListsFixed<T[K]>, undefined | null>
}

/**
 * Replaces all list result types in a query result with types to exclude
 * nulls and undefined from list member unions.
 *
 * If empty members are present, there will also be errors present,
 * and the response will instead be *thrown*.
 */
// type FixedQueryResult<T> =
// 	Exclude<T[keyof T], null | undefined> extends PagedList<any, any>
// 		? {
// 				[K in keyof T]-?: WithListsFixed<
// 					Exclude<T[K], null | undefined>
// 				>
// 			}
// 		: T

/**
 * The return value from a `graphql({query})` call when `query` is a subscription.
 *
 * ```ts
 * //               |-- You are here
 * //               v
 * const subResult: GraphqlSubscriptionResult<T> = client.graphql({
 * 	query: onCreateWidget
 * });
 *
 * const sub = subResult.subscribe({
 * 	//
 * 	//            |-- You are here
 * 	//            v
 * 	next(message: GraphqlSubscriptionMessage<OnCreateWidgetSubscription>) {
 * 		handle(message.value);  // <-- type OnCreateWidgetSubscription
 * 	}
 * })
 * ```
 */
export type GraphqlSubscriptionResult<T> = Observable<
	GraphqlSubscriptionMessage<T>
>

/**
 * The shape of messages passed to `next()` from a graphql subscription. E.g.,
 *
 * ```ts
 * const sub = client.graphql({
 * 	query: onCreateWidget,
 * }).subscribe({
 * 	//
 * 	//            |-- You are here
 * 	//            v
 * 	next(message: GraphqlSubscriptionMessage<OnCreateWidgetSubscription>) {
 * 		handle(message.value);  // <-- type OnCreateWidgetSubscription
 * 	}
 * })
 * ```
 */
export type GraphqlSubscriptionMessage<T> = {
	data: T
}

export enum GraphQLAuthError {
	NO_API_KEY = "No api-key configured",
	NO_CURRENT_USER = "No current user",
	NO_CREDENTIALS = "No credentials",
	NO_FEDERATED_JWT = "No federated jwt",
	NO_AUTH_TOKEN = "No auth token specified",
}

/**
 * GraphQLSource or string, the type of the parameter for calling graphql.parse
 * @see: https://graphql.org/graphql-js/language/#parse
 */
export type GraphQLOperation = Source | string

export type GraphQLOperationType<
	IN extends Record<string, DocumentType>,
	OUT extends Record<string, DocumentType>,
> = {
	variables: IN
	result: OUT
}

export type GeneratedMutation<InputType, OutputType> = string & {
	__generatedMutationInput: InputType
	__generatedMutationOutput: OutputType
}

export type GeneratedSubscription<InputType, OutputType> = string & {
	__generatedSubscriptionInput: InputType
	__generatedSubscriptionOutput: OutputType
}

export const __amplify = Symbol("amplify")
export const __authMode = Symbol("authMode")
export const __authToken = Symbol("authToken")
export const __headers = Symbol("headers")

/**
 * @private
 *
 * The knobs available for configuring `server/generateClient` internally.
 */
export type ServerClientGenerationParams = {
	amplify:
		| null // null expected when used with `generateServerClient`
		// closure expected with `generateServerClientUsingCookies`

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		| ((fn: (amplify: AmplifyClassV6) => Promise<any>) => Promise<any>)
	// global env-sourced config use for retrieving modelIntro
	config: ResourcesConfig
}

export type QueryArgs = Record<string, unknown>

export type AuthModeParams = {
	authMode?: GraphQLAuthMode
	authToken?: string
} & Record<string, unknown>

export type GenerateServerClientParams = {
	config: ResourcesConfig
	authMode?: GraphQLAuthMode
	authToken?: string
}
