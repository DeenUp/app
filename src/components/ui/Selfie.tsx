import { useState } from "react"
import { View } from "react-native"
import { SheetManager } from "react-native-actions-sheet"
import { Avatar } from "react-native-paper"

import twr from "twrnc"

import { useSettingsStore } from "~/stores"

import { AddButton } from "./AwesomeButton"

const Selfie = () => {
	const [selfieImg, _setSelfieImg] = useState<string | null>(null)

	const { theme } = useSettingsStore()

	return (
		<View
			style={twr`flex h-44 w-44 items-center justify-center rounded-full border border-2 border-[${theme.primary}] `}
		>
			{selfieImg ? (
				<Avatar.Image size={150} source={{ uri: selfieImg }} />
			) : (
				<Avatar.Icon
					style={twr`bg-transparent`}
					size={290}
					icon="account"
					color={theme.primary}
				/>
			)}
			<View className="absolute bottom-0 right-0">
				<AddButton onPress={() => SheetManager.show("selfie-sheet")} />
			</View>
		</View>
	)
}

export default Selfie
