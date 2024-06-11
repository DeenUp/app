import type { SheetDefinition } from "react-native-actions-sheet"

import { registerSheet } from "react-native-actions-sheet"

import SelfieSheet from "./SelfieSheet"
import ShareSheet from "./ShareSheet"

registerSheet("selfie-sheet", SelfieSheet)
registerSheet("share-sheet", ShareSheet)

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module "react-native-actions-sheet" {
	type Sheets = {
		"selfie-sheet": SheetDefinition
		"share-sheet": SheetDefinition
	}
}

export {}
