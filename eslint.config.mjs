import path from "path"
import { fileURLToPath } from "url"

import typescriptEslint from "@typescript-eslint/eslint-plugin"
import typescriptParser from "@typescript-eslint/parser"
import importPlugin from "eslint-plugin-import"
import jsxa11y from "eslint-plugin-jsx-a11y"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import reactRecommended from "eslint-plugin-react/configs/recommended.js"
import sortExports from "eslint-plugin-sort-exports"
import globals from "globals"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
	{
		ignores: [
			"dist/**/*",
			"**/*.config.js",
			"**/*.config.mjs",
			"**/*.config.cjs",
			"**/.eslintrc.cjs",
			".detoxrc.js",
			".expo",
			"dist",
			"pnpm-lock.yaml",
			"ios",
			"android",
			"coverage",
		],
	},
	{
		files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
		...reactRecommended,
		settings: {
			version: "detect",
		},
		languageOptions: {
			...reactRecommended.languageOptions,
			ecmaVersion: "latest",
			sourceType: "module",
			parser: typescriptParser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				project: "./tsconfig.json",
				tsConfigRootDir: __dirname,
			},
			globals: {
				...globals.serviceworker,
				...globals.browser,
			},
		},
		plugins: {
			"@typescript-eslint": typescriptEslint,
			react,
			import: importPlugin,
			"jsx-a11y": jsxa11y,
			"react-hooks": reactHooks,
			"sort-exports": sortExports,
		},
		rules: {
			"@typescript-eslint/consistent-type-definitions": ["error", "type"],
			"@typescript-eslint/consistent-type-imports": [
				"warn",
				{ prefer: "type-imports", fixStyle: "separate-type-imports" },
			],
			"@typescript-eslint/no-misused-promises": [
				2,
				{ checksVoidReturn: { attributes: false } },
			],
			"@typescript-eslint/no-unused-vars": [
				"error",
				{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
			],
			"padding-line-between-statements": [
				"error",
				{ blankLine: "always", prev: "*", next: "return" },
			],
			"import/consistent-type-specifier-style": [
				"error",
				"prefer-top-level",
			],
			"sort-exports/sort-exports": ["error", { sortDir: "asc" }],
		},
	},
]
