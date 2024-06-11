import { Text, View } from "react-native"
import ActionSheet from "react-native-actions-sheet"

import { Ionicons } from "@expo/vector-icons"
import twr from "twrnc"

import { ShareButton } from "~/components/ui"
import { useSettingsStore } from "~/stores"

import { CopyButton } from "../ui/AwesomeButton"

const ShareSheet = () => {
	const { theme } = useSettingsStore()

	return (
		<ActionSheet
			elevation={10}
			gestureEnabled={true}
			CustomHeaderComponent={
				<View className="">
					<Ionicons
						name="chevron-down"
						size={30}
						color={theme.primary}
						onPress={() => {}}
					/>
				</View>
			}
			containerStyle={twr`flex h-72 items-center rounded-t-3xl  border-2 border-[${theme.primary}] bg-[#F1E1B4]`}
		>
			<Text className="my-8 text-center text-3xl font-bold text-primary">
				Share with Friends
			</Text>
			<View className=" flex-1 flex-row gap-2">
				<ShareButton
					type="facebook"
					icon="facebook"
					onPress={() => {}}
				/>
				<ShareButton type="twitter" icon="twitter" onPress={() => {}} />

				<ShareButton
					type="messenger"
					icon="facebook-messenger"
					onPress={() => {}}
				/>
				<ShareButton
					type="whatsapp"
					icon="whatsapp"
					onPress={() => {}}
				/>

				<CopyButton onPress={() => {}} />
			</View>
		</ActionSheet>
	)
}

export default ShareSheet
