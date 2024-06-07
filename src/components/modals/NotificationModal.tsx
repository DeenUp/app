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
		"some-action": "Action Success",
		"some-other-action": "Other Action Success",
		signup: "Signup Success",
		login: "Login Success",
		"forgot-password": "Password Reset Success",
		"change-password": "Password Change Success",
		"update-profile": "Profile Update Success",
		"delete-account": "Account Deletion Success",
		"update-email": "Email Update Success",
		"update-phone": "Phone Update Success",
		"update-username": "Username Update Success",
		"update-password": "Password Update Success",
		"update-profile-picture": "Profile Picture Update Success",
		"update-selfie": "Cover Picture Update Success",
		clipboard: "Clipboard Copy Success",
	},
	error: {
		unknown: "Error",
		"some-action": "Action Error",
		"some-other-action": "Other Action Error",
		signup: "Signup Error",
		login: "Login Error",
		"forgot-password": "Password Reset Error",
		"change-password": "Password Change Error",
		"update-profile": "Profile Update Error",
		"delete-account": "Account Deletion Error",
		"update-email": "Email Update Error",
		"update-phone": "Phone Update Error",
		"update-username": "Username Update Error",
		"update-password": "Password Update Error",
		"update-profile-picture": "Profile Picture Update Error",
		"update-selfie": "Cover Picture Update Error",
		clipboard: "Clipboard Copy Error",
	},
	alert: {
		unknown: "Alert",
		"some-action": "Action Alert",
		"some-other-action": "Other Action Alert",
		signup: "Signup Alert",
		login: "Login Alert",
		"forgot-password": "Password Reset Alert",
		"change-password": "Password Change Alert",
		"update-profile": "Profile Update Alert",
		"delete-account": "Account Deletion Alert",
		"update-email": "Email Update Alert",
		"update-phone": "Phone Update Alert",
		"update-username": "Username Update Alert",
		"update-password": "Password Update Alert",
		"update-profile-picture": "Profile Picture Update Alert",
		"update-selfie": "Cover Picture Update Alert",
		clipboard: "Clipboard Copy Alert",
		createGame: "Game Creation Alert",
	},
}

const createModalComponent = (type: "success" | "error" | "alert") => {
	const ModalComponent = ({
		modal: { closeModal, getParam },
	}: ModalProps) => {
		const theme = useSettingsStore((state) => state.theme)

		const origin = getParam(
			"origin",
			"unknown",
		) as keyof (typeof TITLES)[typeof type]
		const message = getParam(
			"message",
			`Something went wrong... 🤔`,
		) as string

		const title = getParam("title", TITLES[type][origin])
		const onConfirm = getParam("onConfirm", () => {})
		const onCancel = getParam("onCancel", () => {})

		return (
			<MotiView
				style={twr`my-32 flex h-2/3 w-[94] items-center justify-around gap-8 rounded-[50px] border-4 border-[${theme.card}] bg-[${theme.background}] py-6 shadow-2xl`}
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
					style={twr`flex h-32 w-32 items-center justify-center rounded-[100]`}
				>
					<LinearGradient
						style={twr`absolute h-full w-full rounded-[100]`}
						colors={["#DDB965", "#F1E1B4"]}
						end={[1, 0]}
						start={[0, 0]}
						locations={[1, 1]}
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
							size={60}
							color={theme.primary}
						/>
					)}

					{type === "success" && (
						<Ionicons
							name="checkbox"
							size={60}
							color={theme.primary}
						/>
					)}
				</View>
				<View className="gap-6">
					<Text className="text-center text-4xl font-bold text-primary">
						{title}
					</Text>
					<Text className="text-center text-xl font-light">
						{message}
					</Text>
				</View>
				<View className="flex items-center justify-center gap-4">
					<ThemedAwesomeButton
						theme="mysterion"
						type="anchor"
						textSize={20}
						width={300}
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
						OK
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
