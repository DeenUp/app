// import  resolveConfig  from "detox/internals"

// import appConfig from "../../../app.json"

type Platform = "ios" | "android"
const platform: Platform = device.getPlatform()

export async function openApp() {
	return await openAppForDebugBuild(platform)
	// const config = await resolveConfig()
	// if (config.configurationName.split(".").includes("debug")) {
	// 	return await openAppForDebugBuild(platform)
	// } else {
	// 	return await device.launchApp({
	// 		newInstance: true,
	// 	})
	// }
}

async function openAppForDebugBuild(platform: Platform) {
	// const deepLinkUrl = process.env.EXPO_USE_UPDATES
	// 	? // Testing latest published EAS update for the test_debug channel
	// 		getDeepLinkUrl(getLatestUpdateUrl())
	// 	: // Local testing with packager
	//
	const deepLinkUrl = getDeepLinkUrl(getDevLauncherPackagerUrl())

	if (platform === "ios") {
		await device.launchApp({
			newInstance: true,
			delete: false,
		})

		await device.openURL({
			url: deepLinkUrl,
		})
	} else {
		await device.launchApp({
			newInstance: true,
			url: deepLinkUrl,
		})
	}

	//	await sleep(3000)
}

const getDeepLinkUrl = (url: string) =>
	`eastestsexample://expo-development-client/?url=${encodeURIComponent(url)}`

const getDevLauncherPackagerUrl = () =>
	`http://localhost:8081/?disableOnboarding=1`

// const getLatestUpdateUrl = () =>
// 	`https://u.expo.dev/${getAppId()}?channel-name=test_debug&disableOnboarding=1`

// const getAppId = () => appConfig?.expo?.extra?.eas?.projectId ?? ""

// const sleep = (t) => new Promise((res) => setTimeout(res, t))
