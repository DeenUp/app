import { useState } from "react"

import * as Haptics from "expo-haptics"
import { XML } from "expo/config-plugins"

import LottieView from "lottie-react-native"
import { AnimatePresence, MotiView } from "moti"
import twr from "twrnc"

import { lottieBlueCheck } from "~/assets"
import Verify from "~/components/auth/Verify"
import {
	EmailInputField,
	PasswordInputField,
	ThemedAwesomeButton,
} from "~/components/ui"
import { useAuthStore, useSettingsStore } from "~/stores"

const ForgotPassword = () => {
	const translate = useSettingsStore((state) => state.translate)
	const {
		email,
		password,
		passwordConfirm,
		setUsername,
		setPassword,
		setConfirmationCode,
		step,
		handleNextStep,
		handlePrevStep,
		errors,
	} = useAuthStore((state) => ({
		setName: state.setName,
		setUsername: state.setUsername,
		setPassword: state.setPassword,
		setConfirmationCode: state.setConfirmationCode,
		handleResetPassword: state.handleResetPassword,
		email: state.username,
		name: state.name,
		password: state.password,
		passwordConfirm: state.setPassword,
		setStep: state.setStep,
		handleNextStep: state.handleNextStep,
		handlePrevStep: state.handlePrevStep,
		step: state.step,
		errors: state.errors,
	}))

	const handleSubmit = () => {
		handleNextStep()
	}

	const handleInputChange = (field: string, value: string) => {
		switch (field) {
			case "email":
				setUsername(value)
				break
			case "password":
				setPassword(value)
				break
			case "confirmPassword":
				setPassword(value)
				break
			case "code":
				setConfirmationCode(value)
				break
			default:
				break
		}
	}

	return (
		<MotiView
			key="forgotPassword"
			from={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			delay={700}
			style={twr`flex-1 items-center justify-between gap-10 py-8`}
			onDidAnimate={() => {
				Haptics.notificationAsync(
					Haptics.NotificationFeedbackType.Success,
				)
			}}
		>
			<AnimatePresence>
				{step === 1 && (
					<MotiView
						key="emailField"
						from={{ opacity: 0, translateY: -20 }}
						animate={{ opacity: 1, translateY: 0 }}
					>
						<EmailInputField
							value={email}
							error={errors.email}
							onChangeText={(value) =>
								handleInputChange("email", value)
							}
						/>
					</MotiView>
				)}
				{step === 2 && (
					<MotiView
						key="verify"
						from={{ opacity: 0, translateY: -20 }}
						animate={{ opacity: 1, translateY: 0 }}
					>
						<Verify error={errors.code} />
					</MotiView>
				)}
				{step === 2 && (
					<MotiView
						key="passwordField"
						from={{ opacity: 0, translateY: -20 }}
						animate={{ opacity: 1, translateY: 0 }}
						style={{ gap: 32 }}
					>
						<PasswordInputField
							value={password}
							error={errors.password}
							onChangeText={(value) =>
								handleInputChange("password", value)
							}
						/>
						<PasswordInputField
							value={password}
							error={errors.confirmPassword}
							onChangeText={(value) =>
								handleInputChange("confirmPassword", value)
							}
						/>
					</MotiView>
				)}
				{step === 3 && (
					<MotiView
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
						}}
						key="verify"
					>
						<LottieView
							source={lottieBlueCheck}
							loop={false}
							autoPlay
							style={{
								width: 500,
								height: 250,
								aspectRatio: "auto",
							}}
						/>
					</MotiView>
				)}
			</AnimatePresence>
			<ThemedAwesomeButton
				progress
				type="anchor"
				size="large"
				width={300}
				onPress={async (next) => {
					if (step === 3) {
						handlePrevStep()
						//@ts-ignore
						next()
					}

					handleSubmit()
					//@ts-ignore
					next()
				}}
			>
				{step === 0
					? translate("authPage.forgotPassword.requestReset")
					: step === 1
						? translate("authPage.verify.submitButton")
						: step === 2
							? translate("authPage.forgotPassword.submitButton")
							: translate("authPage.forgotPassword.backToSignIn")}
			</ThemedAwesomeButton>
		</MotiView>
	)
}

export default ForgotPassword
