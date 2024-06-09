import type { BottomSheetModalProps } from "@gorhom/bottom-sheet"

import { forwardRef, useCallback, useMemo } from "react"
import { Text, View } from "react-native"

import * as Haptics from "expo-haptics"
import { router } from "expo-router"

import { Ionicons } from "@expo/vector-icons"
import {
	BottomSheetModal,
	BottomSheetModalProvider,
} from "@gorhom/bottom-sheet"
import twr from "twrnc"

import { ShareButton, ThemedAwesomeButton } from "~/components/ui"
import { useSettingsStore } from "~/stores"

export const CustomBottomSheetModal = forwardRef<
	BottomSheetModal,
	BottomSheetModalProps
>((props: any, ref: any) => {
	const snapPoints =
		props && props.snapPoints
			? props.snapPoints
			: useMemo(() => ["25%", "35%"], [])
	const { theme } = useSettingsStore()

	const handleSheetChanges = useCallback((index: number) => {
		console.log("handleSheetChanges", index)
	}, [])

	return (
		<BottomSheetModalProvider>
			<BottomSheetModal
				ref={ref}
				index={1}
				snapPoints={snapPoints}
				onChange={handleSheetChanges}
				style={twr`bg-transparent`}
				animationConfigs={{
					duration: 300,
				}}
				handleComponent={() => {
					return (
						<View className="-mb-10 items-center justify-center">
							<Ionicons
								name="chevron-down"
								size={30}
								color={theme.primary}
								onPress={() => {
									Haptics.impactAsync(
										Haptics.ImpactFeedbackStyle.Rigid,
									)
									ref.current?.close()
								}}
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
				{props.children}
			</BottomSheetModal>
		</BottomSheetModalProvider>
	)
})

export const SelfieBottomSheetModal = forwardRef<BottomSheetModal>(
	(props: any, ref: any) => {
		const { theme } = useSettingsStore()

		return (
			<CustomBottomSheetModal ref={ref} {...props}>
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
			</CustomBottomSheetModal>
		)
	},
)

export const ShareBottomSheetModal = forwardRef<BottomSheetModal>(
	(props: any, ref: any) => {
		// const { theme } = useSettingsStore()

		return (
			<CustomBottomSheetModal
				snapPoints={["25%", "40%"]}
				ref={ref}
				{...props}
			>
				<View className="shadow-3xl flex-1 flex-col items-center justify-center gap-4 rounded-[50px] border-4 border-primary bg-surface py-12">
					<Text className="text-3xl font-bold text-primary">
						Share with Friends
					</Text>
					<View className="flex-1 flex-row gap-2">
						<ShareButton
							type="facebook"
							icon="facebook"
							onPress={() => {
								Haptics.impactAsync(
									Haptics.ImpactFeedbackStyle.Rigid,
								)
							}}
						/>
						<ShareButton
							type="twitter"
							icon="twitter"
							onPress={() => {
								Haptics.impactAsync(
									Haptics.ImpactFeedbackStyle.Rigid,
								)
							}}
						/>

						<ShareButton
							type="messenger"
							icon="facebook-messenger"
							onPress={() => {
								Haptics.impactAsync(
									Haptics.ImpactFeedbackStyle.Rigid,
								)
							}}
						/>
						<ShareButton
							type="whatsapp"
							icon="whatsapp"
							onPress={() => {
								Haptics.impactAsync(
									Haptics.ImpactFeedbackStyle.Rigid,
								)
							}}
						/>
					</View>
				</View>
			</CustomBottomSheetModal>
		)
	},
)
