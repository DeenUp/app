/** @type {import('tailwindcss').Config} */

// @ts-expect-error - no types
import nativewind from "nativewind/preset"

const { colors } = require("./src/constants/colors.ts")

module.exports = {
	content: ["./src/**/*.{ts,tsx}"],
	presets: [nativewind],
	theme: {
		extend: {
			colors,
		},
	},
}
