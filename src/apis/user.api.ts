import type { GraphQLResult } from "aws-amplify/api"

import type {
	GetUserQuery,
	GetUserQueryVariables,
	ListUsersQuery,
	ListUsersQueryVariables,
	ModelUserConnection,
	ModelUserFilterInput,
	UpdateUserMutation,
	UpdateUserMutationVariables,
	User,
} from "../graphql/api"
import type {
	GraphQLService,
	ItemResponse,
	IUserApi,
	ListQueryParams,
	ListResponse,
	StorageService,
} from "../types"

import { updateUser } from "../graphql/mutations"
import { getUser, listUsers } from "../graphql/queries"
import { AmplifyGraphqlService, AmplifyStorageService } from "../services"

export default class UserApi implements IUserApi {
	private readonly graphqlService: GraphQLService
	private readonly storageService: StorageService

	constructor(
		graphqlService?: GraphQLService,
		storageService?: StorageService,
	) {
		this.graphqlService = graphqlService ?? new AmplifyGraphqlService()
		this.storageService = storageService ?? new AmplifyStorageService()
	}

	async get(id: string): Promise<ItemResponse<User>> {
		const response = await this.graphqlService.query<
			typeof getUser,
			GetUserQueryVariables,
			GraphQLResult<GetUserQuery>
		>(getUser, {
			id,
		})

		if (response.errors) {
			return {
				error: new Error(response.errors[0]!.message),
				hasError: true,
				hasData: false,
			}
		}

		const user = response.data.getUser as User | null

		if (user?.selfie) {
			user.selfie = await this.storageService.fetchUrl(user.selfie)
		}

		return {
			hasError: false,
			hasData: user !== null,
			item: user,
		}
	}

	async list(
		params: ListQueryParams<ModelUserFilterInput | null | undefined>,
	): Promise<ListResponse<User>> {
		const response = await this.graphqlService.query<
			typeof listUsers,
			ListUsersQueryVariables,
			GraphQLResult<ListUsersQuery>
		>(listUsers, {
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

		const connection = response.data.listUsers as ModelUserConnection
		const users = await Promise.all(
			(connection.items as User[]).map(async (user) => {
				if (user?.selfie) {
					user.selfie = await this.storageService.fetchUrl(
						user.selfie,
					)
				}

				return user
			}),
		)

		return {
			hasError: false,
			hasData: true,
			items: users,
			nextToken: connection.nextToken,
		}
	}

	async update(
		input: User,
		image?: File | null,
	): Promise<ItemResponse<User>> {
		if (image) {
			input.selfie = await this.storageService.upload(
				`users/${input.id}/selfie.png`,
				image,
			)
		}

		const response = await this.graphqlService.mutate<
			typeof updateUser,
			UpdateUserMutationVariables,
			GraphQLResult<UpdateUserMutation>
		>(updateUser, {
			input: input,
		})

		if (response.errors) {
			return {
				error: new Error(response.errors[0]!.message),
				hasError: true,
				hasData: false,
			}
		}

		const updatedUser = response.data.updateUser as User

		if (updatedUser?.selfie) {
			updatedUser.selfie = await this.storageService.fetchUrl(
				updatedUser.selfie,
			)
		}

		return {
			hasError: false,
			hasData: true,
			item: updatedUser,
		}
	}
}
