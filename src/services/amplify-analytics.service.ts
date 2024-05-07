import type { AnalyticsService } from "~/types"

export default class AmplifyGraphqlService implements AnalyticsService {
	setUserId(id: string): Promise<void> {
		console.log(id)
		throw new Error("Method not implemented.")
	}

	trackEvent(options: {
		eventName: string
		params?: Record<string, unknown>
	}): Promise<void> {
		console.log(options)
		throw new Error("Method not implemented.")
	}
}
