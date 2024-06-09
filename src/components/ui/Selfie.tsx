import type { BottomSheetModal } from "@gorhom/bottom-sheet"

import { useState } from "react"
import { View } from "react-native"
import { Avatar } from "react-native-paper"

import twr from "twrnc"

import { useSettingsStore } from "~/stores"

import { AddButton } from "./AwesomeButton"

type Props = {
	selfieBottomSheetModalRef: React.RefObject<BottomSheetModal>
}

const Selfie = ({ selfieBottomSheetModalRef }: Props) => {
	const [selfieImg, _setSelfieImg] = useState<string | null>(null)

	const { theme } = useSettingsStore()

	return (
		<View
			style={twr`flex h-44 w-44 items-center justify-center rounded-full border border-2 border-[${theme.primary}] `}
		>
			{/* <Avatar.Image size={150} source={} /> */}
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
				<AddButton
					onPress={() => selfieBottomSheetModalRef.current?.present()}
				/>
			</View>
		</View>
	)
}

export default Selfie
