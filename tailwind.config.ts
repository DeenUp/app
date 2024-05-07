/** @type {import('tailwindcss').Config} */

// @ts-expect-error - no types
import nativewind from "nativewind/preset"

export default {
	content: ["./src/**/*.{ts,tsx}"],
	presets: [nativewind],
	theme: {
		extend: {
			colors: {
				primary: "#6D28D9",
				secondary: "#007EBD",
				tertiary: "#FF00FF",
				accent: "#F8860D",
				neutral: "#1E2734",
				"base-100": "#FFFFFF",
				"base-200": "#F9FAFB",
				"base-300": "#CED3D9",
				info: "#1C92F2",
				success: "#009485",
				warning: "#FF9900",
				error: "#FF5724",
				card: "#F9FAFB",
				input: "#F9FAFB",
				"input-focus": "#FFFFFF",
				"input-placeholder": "#CED3D9",
				"input-border": "#CED3D9",
				"input-error": "#FF5724",
				"input-success": "#009485",
				"input-warning": "#FF9900",
				"input-info": "#1C92F2",
			},
		},
	},
}
