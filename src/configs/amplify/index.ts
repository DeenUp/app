//@ts-ignore
import type { ResourcesConfig } from "aws-amplify"

import { flavor } from "../envs.config"
import * as AmplifyDev from "./amplify-dev.json"
import * as AmplifyProd from "./amplify-production.json"
import * as AmplifyStaging from "./amplify-staging.json"

const getAmplifyConfig = (): ResourcesConfig => {
	switch (flavor) {
		case "production":
			return AmplifyProd as ResourcesConfig
		case "staging":
			return AmplifyStaging as ResourcesConfig
		case "dev":
			return AmplifyDev as ResourcesConfig
	}
}

export default getAmplifyConfig
