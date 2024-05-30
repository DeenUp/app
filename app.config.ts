import "ts-node/register"

import type { ConfigContext, ExpoConfig } from "@expo/config"

import { withBuildProperties } from "expo-build-properties"

import type { Flavor } from "~/types"

import { version, versionCode } from "./version.json"

/* eslint-disable import/first */
require("dotenv").config()

const { EXPO_PROJECT_ID, FLAVOR } = process.env

const projectId: string = EXPO_PROJECT_ID as string
const flavor: Flavor = FLAVOR as Flavor

const getOrganizationDomain = (): string => {
	const organizationDomain = "ca.mohd.deenup"

	switch (flavor) {
		case "production":
			return organizationDomain
		case "staging":
			return `${organizationDomain}.${flavor}`
		case "dev":
			return `${organizationDomain}.${flavor}`
	}
}

// const getBaseDomain = (): string => {
// 	const baseDomain = "deenup.mohd.ca"

// 	switch (flavor) {
// 		case "production":
// 			return `${baseDomain}`
// 		case "staging":
// 			return `${flavor}.${baseDomain}`
// 		case "dev":
// 			return `${flavor}.${baseDomain}`
// 	}
// }

const getDeeplinkDomain = (): string => {
	const deeplinkDomain = "deeplink.deenup.mohd.ca"

	switch (flavor) {
		case "production":
			return `${deeplinkDomain}`
		case "staging":
			return `${flavor}.${deeplinkDomain}`
		case "dev":
			return `${flavor}.${deeplinkDomain}`
	}
}

const getScheme = (): string => {
	return flavor
}

const getPlugins = (): (string | [] | [string] | [string, unknown] | any)[] => {
	const plugins = [
		"expo-router",
		"expo-splash-screen",
		"expo-font",
		"expo-localization",
		[
			"expo-build-properties",
			{
				ios: {
					useFrameworks: "static",
				},
			},
		],
		[
			"expo-image-picker",
			{
				photosPermission: [
					"We need your permission to access",
					"photos so you can set a profile picture.",
				].join(" "),
			},
		],
		[
			withBuildProperties,
			{
				android: {
					compileSdkVersion: 34,
					targetSdkVersion: 34,
					buildToolsVersion: "31.0.0",
					enableProguardInReleaseBuilds: true,
				},
				ios: {
					useFrameworks: "static",
				},
			},
		],
	]

	return plugins
}

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	owner: "deenup",
	android: {
		adaptiveIcon: {
			foregroundImage: `./src/assets/app-icon/${flavor}/adaptive-foreground.png`,
			monochromeImage: `./src/assets/app-icon/${flavor}/adaptive-foreground.png`,
			backgroundColor: "#472836",
		},
		icon: `./src/assets/app-icon/${flavor}/android.png`,
		intentFilters: [
			{
				action: "VIEW",
				autoVerify: true,
				data: [
					{
						scheme: "https",
						host: getDeeplinkDomain(),
					},
				],
				category: ["BROWSABLE", "DEFAULT"],
			},
		],
		package: getOrganizationDomain(),
		permissions: [
			"CAMERA",
			"CAMERA_ROLL",
			"MEDIA_LIBRARY",
			"READ_EXTERNAL_STORAGE",
			"WRITE_EXTERNAL_STORAGE",
			"VIBRATE",
		],
		softwareKeyboardLayoutMode: "pan",
		splash: {
			backgroundColor: "#472836",
			image: `./src/assets/app-icon/${flavor}/adaptive-foreground.png`,
			resizeMode: "contain",
		},
		versionCode,
	},
	assetBundlePatterns: ["**/*"],
	experiments: {
		typedRoutes: true,
	},
	extra: {
		flavor,
		bundleIdentifier: getOrganizationDomain(),
		androidPackage: getOrganizationDomain(),
		eas: {
			projectId,
		},
	},
	icon: `./src/assets/app-icon/${flavor}/web/icon-512.png`,
	ios: {
		// associatedDomains: [
		// 	`applinks:${getBaseDomain()}`,
		// 	`applinks:${getDeeplinkDomain()}`,
		// ],
		bundleIdentifier: getOrganizationDomain(),
		buildNumber: `${versionCode}`,
		icon: `./src/assets/app-icon/${flavor}/ios.png`,
		supportsTablet: true,
		infoPlist: {
			UIViewControllerBasedStatusBarAppearance: "YES",
		},
	},
	name: "DeenUp",
	notification: {
		androidMode: "default",
		color: "#472836",
		iosDisplayInForeground: true,
	},
	orientation: "portrait",
	platforms: ["ios", "android", "web"],
	plugins: getPlugins(),
	privacy: "hidden",
	scheme: getScheme(),
	slug: "deenup",
	splash: {
		image: "./src/assets/app-icon/production/web/icon-512.png",
		resizeMode: "contain",
		backgroundColor: "#472836",
	},
	userInterfaceStyle: "automatic",
	web: {
		favicon: `./src/assets/app-icon/${flavor}/web/favicon.ico`,
		themeColor: "#472836",
	},

	version,
})
