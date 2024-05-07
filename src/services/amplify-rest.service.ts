/* eslint-disable @typescript-eslint/no-explicit-any */
import { del, get, post, put } from "aws-amplify/api"
import { fetchAuthSession } from "aws-amplify/auth"

import type { RestService } from "~/types"

export default class AmplifyRestService implements RestService {
	private readonly apiName: string

	constructor(apiName: string) {
		this.apiName = apiName
	}

	async post<T>(url: string, body: Record<string, any>): Promise<T> {
		const options = {
			headers: {
				Authorization: `Bearer ${(
					await fetchAuthSession()
				).tokens?.idToken?.toString()}`,
			},
			body,
		}

		const res = await post({ apiName: this.apiName, path: url, options })
			.response

		return res.body.json() as T
	}

	async get<T>(url: string): Promise<T> {
		const options = {
			headers: {
				Authorization: `Bearer ${(
					await fetchAuthSession()
				).tokens?.idToken?.toString()}`,
			},
		}

		const res = await get({ apiName: this.apiName, path: url, options })
			.response

		return res.body.json() as T
	}

	async put<T>(url: string, body: Record<string, any>): Promise<T> {
		const options = {
			headers: {
				Authorization: `Bearer ${(
					await fetchAuthSession()
				).tokens?.idToken?.toString()}`,
			},
			body,
		}

		const res = await put({ apiName: this.apiName, path: url, options })
			.response

		return res.body.json() as T
	}

	async delete(url: string): Promise<number> {
		const options = {
			headers: {
				Authorization: `Bearer ${(
					await fetchAuthSession()
				).tokens?.idToken?.toString()}`,
			},
		}

		const res = await del({ apiName: this.apiName, path: url, options })
			.response

		return res.statusCode
	}
}
