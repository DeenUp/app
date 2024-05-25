const fs = require("fs")

try {
	// Read and parse package.json
	const packageJSON = JSON.parse(fs.readFileSync("./package.json", "utf-8"))

	// Read and parse version.json
	const versionJSON = JSON.parse(fs.readFileSync("./version.json", "utf-8"))

	// Increment the versionCode
	const newVersionJSON = {
		version: packageJSON.version,
		versionCode: versionJSON.versionCode + 1,
	}

	console.log("New version.json data:", newVersionJSON)

	// Write updated data to version.json
	const data = JSON.stringify(newVersionJSON, null, 2)
	fs.writeFileSync("./version.json", data)

	console.log("version.json updated successfully")
} catch (error) {
	console.error("Error:", error)
}
