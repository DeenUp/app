require("dotenv").config()

const fs = require("fs")
const { FLAVOR, AMPLIFY_CONFIG } = process.env

const run = () => {
	const data = Buffer.from(JSON.stringify({ AMPLIFY_CONFIG }))
	fs.writeFileSync(
		`src/configs/amplify/amplify-${FLAVOR}.json`,
		data.toString("base64"),
	)
}

run()
