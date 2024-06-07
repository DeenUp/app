import type { ModalProps } from "react-native-modalfy"

import React from "react"
import { Text, View } from "react-native"

import { LinearGradient } from "expo-linear-gradient"

import { Ionicons } from "@expo/vector-icons"
import { MotiView } from "moti"
import twr from "twrnc"

import { useSettingsStore } from "~/stores"

import { CloseButton, ThemedAwesomeButton } from "../ui"

const TITLES = {
	success: {
		unknown: "Success",
	},
	error: {
		unknown: "Error",
	},
	alert: {
		unknown: "Alert",
	},
}

const createModalComponent = (type: "success" | "error" | "alert") => {
	const ModalComponent = ({
		modal: { closeModal, getParam },
	}: ModalProps) => {
		const { theme } = useSettingsStore()

		const message = getParam(
			"message",
			`Something went wrong... 🤔`,
		) as string

		const title = getParam("title", TITLES[type].unknown)
		const onConfirm = getParam("onConfirm", () => {})
		const onCancel = getParam("onCancel", () => {})
		const confirmButtonText = getParam("confirmButtonText", "OK")

		return (
			<MotiView
				from={{ scale: 0.1 }}
				animate={{ scale: 1 }}
				transition={{ type: "spring", damping: 20, stiffness: 300 }}
				style={twr`my-32 flex h-2/3 w-[94] items-center justify-around gap-8 rounded-[50px] border-4 border-[${theme.card}] bg-[${theme.card}] py-6 shadow-2xl`}
			>
				<View className="absolute right-8 top-4">
					<CloseButton
						onPress={() => {
							onCancel()
							closeModal(
								type === "success"
									? "SuccessModal"
									: type === "error"
										? "ErrorModal"
										: "AlertModal",
							)
						}}
					/>
				</View>
				<View
					style={twr`h-42 w-42 flex items-center justify-center rounded-[100]`}
				>
					<LinearGradient
						style={twr`absolute h-full w-full rounded-[100]`}
						colors={["#DDB965", "#F1E1B4"]}
						end={[0, 1]}
						start={[1, 1]}
						locations={[0.1, 1]}
					/>
					{type === "error" && (
						<Ionicons
							name="close"
							size={60}
							color={theme.primary}
						/>
					)}
					{type === "alert" && (
						<Ionicons
							name="alert-circle"
							size={70}
							color={theme.primary}
						/>
					)}

					{type === "success" && (
						<Ionicons
							name="checkbox"
							size={70}
							color={theme.primary}
						/>
					)}
				</View>
				<View className="gap-6">
					<Text className="text-center text-[48px] font-extrabold text-primary">
						{title}
					</Text>
					<Text className="text-center text-xl font-light">
						{message}
					</Text>
				</View>
				<View className="flex items-center justify-center gap-4">
					<ThemedAwesomeButton
						theme="mysterion"
						type={type === "success" ? "anchor" : "danger"}
						textSize={20}
						width={300}
						textColor="white"
						onPress={() => {
							onConfirm()
							closeModal(
								type === "success"
									? "SuccessModal"
									: type === "error"
										? "ErrorModal"
										: "AlertModal",
							)
						}}
					>
						{confirmButtonText}
					</ThemedAwesomeButton>
				</View>
			</MotiView>
		)
	}

	return ModalComponent
}

export const AlertModal = createModalComponent("alert")
export const ErrorModal = createModalComponent("error")
export const SuccessModal = createModalComponent("success")
