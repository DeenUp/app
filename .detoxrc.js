/** @type {Detox.DetoxConfig} */
module.exports = {
	testRunner: {
		args: {
			$0: "jest",
			config: "e2e/jest.config.js",
			_: ["e2e"],
		},
		jest: {
			setupTimeout: 120000,
		},
	},
	artifacts: {
		plugins: {
			log: process.env.CI ? "failing" : undefined,
			screenshot: "failing",
		},
	},
	apps: {
		"ios.debug": {
			type: "ios.app",
			binaryPath:
				"ios/build/Build/Products/Debug-iphonesimulator/DeenUp.app",
			build: "xcodebuild -workspace ios/DeenUp.xcworkspace -scheme DeenUp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
		},
		"ios.release": {
			type: "ios.app",
			binaryPath:
				"ios/build/Build/Products/Release-iphonesimulator/DeenUp.app",
			build: "xcodebuild -workspace ios/DeenUp.xcworkspace -scheme DeenUp -configuration Release -sdk iphonesimulator -derivedDataPath ios/build",
		},
		"android.debug": {
			type: "android.apk",
			binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
			build: "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug",
			reversePorts: [8081],
		},
		"android.release": {
			type: "android.apk",
			binaryPath: "android/app/build/outputs/apk/release/app-release.apk",
			build: "cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release",
		},
	},
	devices: {
		simulator: {
			type: "ios.simulator",
			device: {
				type: "iPhone 14",
			},
		},
		attached: {
			type: "android.attached",
			device: {
				adbName: ".*",
			},
		},
		emulator: {
			type: "android.emulator",
			device: {
				avdName: "Resizable_Experimental_API_34",
			},
		},
	},
	configurations: {
		"ios.sim.debug": {
			device: "simulator",
			app: "ios.debug",
		},
		"ios.sim.release": {
			device: "simulator",
			app: "ios.release",
		},
		"android.att.debug": {
			device: "attached",
			app: "android.debug",
		},
		"android.att.release": {
			device: "attached",
			app: "android.release",
		},
		"android.emu.debug": {
			device: "emulator",
			app: "android.debug",
		},
		"android.emu.release": {
			device: "emulator",
			app: "android.release",
		},
	},
}
