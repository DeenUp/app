import type { ResourcesConfig } from "aws-amplify"

//@ts-ignore
import * as AmplifyConfig from "../../../amplify.json"

const getAmplifyConfig = (): ResourcesConfig => {
	const config = AmplifyConfig

	if (!config) {
		throw new Error(`Amplify config not found`)
	}

	return config
}

export default getAmplifyConfig
