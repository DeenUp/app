import { useState } from "react"

import * as Haptics from "expo-haptics"

import LottieView from "lottie-react-native"
import { AnimatePresence, MotiImage, MotiView } from "moti"
import twr from "twrnc"

import { lottieBlueCheck } from "~/assets"
import SignUpEmailImage from "~/assets/images/auth/signup-email.png"
import SignUpNameImage from "~/assets/images/auth/signup-name.png"
import Verify from "~/components/auth/Verify"
import {
	EmailInputField,
	NameInputField,
	PasswordInputField,
	Selfie,
	ThemedAwesomeButton,
} from "~/components/ui"
import { useAuthStore, useSettingsStore } from "~/stores"

export enum UserType {
	ADMIN = "ADMIN",
	PLAYER = "PLAYER",
}

const SignUp = () => {
	const translate = useSettingsStore((state) => state.translate)
	const {
		name,
		email,
		password,
		confirmationCode,
		setName,
		setUsername,
		setPassword,
		handleSignUp,
		handleConfirmSignUp,
		step,
		handleNextStep,
		setIsSignUp,
		errors,
	} = useAuthStore((state) => ({
		name: state.name,
		email: state.username,
		password: state.password,
		confirmationCode: state.confirmationCode,
		loading: state.loading,
		setName: state.setName,
		setUsername: state.setUsername,
		setPassword: state.setPassword,
		handleSignUp: state.handleSignUp,
		handleConfirmSignUp: state.handleConfirmSignUp,
		setStep: state.setStep,
		handleNextStep: state.handleNextStep,
		handlePrevStep: state.handlePrevStep,
		setIsSignUp: state.setIsSignUp,
		step: state.step,
		errors: state.errors,
	}))

	const [codeError, setCodeError] = useState("")

	const handleSubmit = async () => {
		if (Object.values(errors).some((error) => error !== "")) {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

			return
		}

		await handleSignUp({
			onVerificationRequired: () => {
				handleNextStep()
			},
		})
	}

	const handleVerifySubmit = async () => {
		if (confirmationCode!.length !== 6) {
			setCodeError("Code must be 6 digits")

			return
		}

		await handleConfirmSignUp({
			onSuccess: () => {
				handleNextStep()
			},
		})
	}

	const handleInputChange = (field: string, value: string) => {
		if (value === "Enter") handleContinue()
		switch (field) {
			case "name":
				setName(value)
				break
			case "email":
				setUsername(value)
				break
			case "password":
				setPassword(value)
				break
			default:
				break
		}
	}

	return (
		<MotiView
			key="signup"
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
				{step === 5 && (
					<MotiView
						key="nameField"
						from={{ opacity: 0, translateY: -20 }}
						animate={{ opacity: 1, translateY: 0 }}
						style={twr`flex-1 items-center justify-between gap-10`}
					>
						<NameInputField
							error={errors.name}
							value={name}
							onChangeText={(value) =>
								handleInputChange("name", value)
							}
						/>
						<MotiImage
							source={SignUpNameImage}
							style={twr`h-64 w-64`}
						/>
					</MotiView>
				)}
				{step === 2 && (
					<MotiView
						key="emailField"
						from={{ opacity: 0, translateY: -20 }}
						animate={{ opacity: 1, translateY: 0 }}
						style={twr`flex-1 items-center justify-between gap-10`}
					>
						<EmailInputField
							error={""}
							value={email}
							onChangeText={(value) =>
								handleInputChange("email", value)
							}
						/>
						<MotiImage
							source={SignUpEmailImage}
							style={twr`h-64 w-64`}
						/>
					</MotiView>
				)}
				{step === 3 && (
					<MotiView
						key="passwordField"
						from={{ opacity: 0, translateY: -20 }}
						animate={{ opacity: 1, translateY: 0 }}
					>
						<PasswordInputField
							error={errors.password}
							value={password}
							onChangeText={(value) =>
								handleInputChange("password", value)
							}
						/>
					</MotiView>
				)}
				{step === 4 && (
					<MotiView
						key="verification"
						from={{ opacity: 0, translateY: -20 }}
						animate={{ opacity: 1, translateY: 0 }}
					>
						<Verify error={codeError} key="verify" />
					</MotiView>
				)}
				{/* Selfie */}
				{step === 1 && (
					<MotiView
						key="selfie"
						from={{ opacity: 0, translateY: -20 }}
						animate={{ opacity: 1, translateY: 0 }}
					>
						<Selfie />
					</MotiView>
				)}

				{step === 6 && (
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
								width: 300,
								height: 500,
							}}
						/>
					</MotiView>
				)}
			</AnimatePresence>

			<ThemedAwesomeButton
				progress
				type="anchor"
				size="large"
				width={350}
				textSize={20}
				onPress={async (next) => {
					if (step === 2) {
						await handleSubmit()
						//@ts-ignore
						next()
					}

					if (step === 3) {
						await handleVerifySubmit()
						//@ts-ignore
						next()
					}

					handleNextStep()
					//@ts-ignore
					next()
				}}
			>
				{step < 2
					? translate("authPage.signUp.continueButton")
					: step === 2
						? translate("authPage.signUp.submitButton")
						: step === 3
							? translate("authPage.signUp.verifyButton")
							: translate("authPage.signUp.backToSignIn")}
			</ThemedAwesomeButton>
		</MotiView>
	)
}

export default SignUp
