//@ts-ignore
import type { ResourcesConfig } from "aws-amplify"

import { flavor } from "../envs.config"
//@ts-ignore
import * as AmplifyDev from "./amplify-dev.json"
//@ts-ignore
import * as AmplifyProd from "./amplify-production.json"
//@ts-ignore
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
