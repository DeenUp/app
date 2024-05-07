import { getUrl, uploadData } from "aws-amplify/storage"

import type { StorageService } from "~/types"

export default class AmplifyStorageService implements StorageService {
	download = async (key: string): Promise<File> => {
		const response = await fetch(await this.fetchUrl(key))
		const blob = await response.blob()

		return new File([blob], key)
	}

	fetchUrl = async (key: string): Promise<string> => {
		const result = await getUrl({
			key,
		})

		return result.url.toString()
	}

	upload = async (key: string, file: File): Promise<string> => {
		const result = await uploadData({
			key,
			data: file,
		}).result

		return result.key
	}
}
