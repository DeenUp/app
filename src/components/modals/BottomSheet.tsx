import { forwardRef, useCallback, useMemo } from "react"
import { View } from "react-native"

import * as Haptics from "expo-haptics"
import { router } from "expo-router"

import { Ionicons } from "@expo/vector-icons"
import {
	BottomSheetModal,
	BottomSheetModalProvider,
} from "@gorhom/bottom-sheet"
import twr from "twrnc"

import { useSettingsStore } from "~/stores"

import { ThemedAwesomeButton } from "../ui"

export const SelfieBottomSheetModal = forwardRef<BottomSheetModal>(
	(props: any, ref: any) => {
		const snapPoints = useMemo(() => ["25%", "35%"], [])
		const { theme } = useSettingsStore()

		const handleSheetChanges = useCallback((index: number) => {
			return index
		}, [])

		return (
			<BottomSheetModalProvider>
				<BottomSheetModal
					ref={ref}
					index={1}
					snapPoints={snapPoints}
					onChange={handleSheetChanges}
					style={twr`bg-transparent`}
					handleComponent={() => {
						return (
							<View className=" items-center justify-center">
								<Ionicons
									name="chevron-down"
									size={24}
									color={theme.primary}
								/>
							</View>
						)
					}}
					backgroundComponent={(props) => {
						return (
							<View
								style={twr`flex-1 bg-[#000000] bg-opacity-50`}
								{...props}
							/>
						)
					}}
				>
					<View className="flex-1 items-center justify-center gap-4 rounded-[50px] border-2 border-primary bg-[#F1E1B4] shadow-2xl">
						<ThemedAwesomeButton
							theme={"mysterion"}
							type="primary"
							size="large"
							onPress={() => {
								Haptics.impactAsync(
									Haptics.ImpactFeedbackStyle.Rigid,
								)
								router.push("/solo-mode")
							}}
							width={300}
							height={50}
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
							onPress={() => {
								Haptics.impactAsync(
									Haptics.ImpactFeedbackStyle.Rigid,
								)
								router.push("/solo-mode")
							}}
							width={300}
							height={50}
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
				</BottomSheetModal>
			</BottomSheetModalProvider>
		)
	},
)
