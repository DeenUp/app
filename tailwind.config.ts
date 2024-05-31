/** @type {import('tailwindcss').Config} */

// @ts-expect-error - no types
import nativewind from "nativewind/preset"

import { colors } from "./src/constants"

module.exports = {
	content: ["./src/**/*.{ts,tsx}"],
	presets: [nativewind],
	theme: {
		extend: {
			colors,
		},
	},
}
