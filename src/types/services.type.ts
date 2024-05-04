export type AnalyticsService = {
	setUserId(id: string): Promise<void>
	trackEvent(options: {
		eventName: string
		params?: Record<string, unknown>
	}): Promise<void>
}

export type GraphQLService = {
	mutate<M, V, T>(mutation: M, variables: V): Promise<T>
	query<Q, V, T>(query: Q, variables: V): Promise<T>
	subscribe<S, V, T>(subscription: S, variables: V): T
}

export type RestService = {
	post<T>(url: string, body: Record<string, unknown>): Promise<T>
	get<T>(url: string): Promise<T>
	put<T>(url: string, body: Record<string, unknown>): Promise<T>
	delete(url: string): Promise<number>
}

export type StorageService = {
	download(key: string): Promise<File>
	fetchUrl(key: string): Promise<string>
	upload(key: string, file: File): Promise<string>
}
