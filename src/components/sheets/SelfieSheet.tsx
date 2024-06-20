import { View } from "react-native"
import ActionSheet from "react-native-actions-sheet"

import { router } from "expo-router"

import { Ionicons } from "@expo/vector-icons"
import twr from "twrnc"

import { ThemedAwesomeButton } from "~/components/ui"
import { useSettingsStore } from "~/stores"

const SelfieSheet = () => {
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
			containerStyle={twr`h-64 items-center rounded-t-3xl border-[${theme.primary}] bg-[${theme.sheet}]`}
		>
			<View className="flex-1 items-center justify-center gap-4">
				<ThemedAwesomeButton
					theme={"mysterion"}
					type="primary"
					size="large"
					onPress={() => {}}
					width={300}
					height={70}
					textSize={18}
					after={
						<Ionicons
							name="camera"
							size={24}
							color={"white"}
							style={twr`ml-2`}
						/>
					}
				>
					Take a Selfie
				</ThemedAwesomeButton>
				<ThemedAwesomeButton
					theme={"mysterion"}
					type="secondary"
					size="large"
					onPress={() => {}}
					width={300}
					height={70}
					textSize={18}
					after={
						<Ionicons
							name="images"
							size={24}
							color={theme.primary}
							style={twr`ml-2`}
						/>
					}
				>
					From Camera Roll
				</ThemedAwesomeButton>
			</View>
		</ActionSheet>
	)
}

export default SelfieSheet
