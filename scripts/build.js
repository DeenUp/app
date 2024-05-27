require("dotenv").config()

const { spawn, spawnSync } = require("child_process")
const { version } = require("../version.json")
const { FLAVOR, PLATFORM, DISTRIBUTION } = process.env

// Usage: ENV=dev FLAVOR=courier pnpm run build-js
// Usage: ENV=dev FLAVOR=consumer DISTRIBUTION=devclient pnpm run build-js
// Usage: ENV=staging FLAVOR=courier PLATFORM=ios pnpm run build-js

const run = async () => {
	if (!FLAVOR) {
		console.error("FLAVOR undefined")
		process.exit(-1)
	}

	if (!PLATFORM) {
		console.warn("PLATFORM not defined: using android")
	}

	const releaseChannel = `v${version.slice(0, version.indexOf("."))}`
	const platform = PLATFORM ?? "android"
	const distribution = DISTRIBUTION ?? "internal"
	const profile = `${FLAVOR}`

	console.log("profile:", profile)

	spawnSync("pnpm", ["run", "prepare-env"])
	process.env["EAS_NO_VCS"] = "1"
	spawn(
		"eas",
		["build", "--platform", platform, "--profile", profile, "--local"],
		{
			stdio: "inherit",
		},
	)
}

run()
	.then(() => null)
	.catch(console.error)
