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
	Transition,
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
		if (Object.values(errors).some((error) => error !== "")) {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

			return
		}

		await handleConfirmSignUp({
			onSuccess: () => {
				handleNextStep()
			},
		})
	}

	const handleInputChange = (field: string, value: string) => {
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
			<AnimatePresence exitBeforeEnter>
				{step === 1 && (
					<Transition key="nameField" style="gap-10">
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
					</Transition>
				)}
				{step === 2 && (
					<Transition key="emailField" style="gap-10">
						<EmailInputField
							error={errors.email}
							value={email}
							onChangeText={(value) =>
								handleInputChange("email", value)
							}
						/>
						<MotiImage
							source={SignUpEmailImage}
							style={twr`h-64 w-64`}
						/>
					</Transition>
				)}
				{step === 3 && (
					<Transition key="passwordField" style="gap-10">
						<PasswordInputField
							error={errors.password}
							value={password}
							onChangeText={(value) =>
								handleInputChange("password", value)
							}
						/>
					</Transition>
				)}
				{step === 4 && (
					<Transition key="verification" style="gap-10">
						<Verify error={errors.code} key="verify" />
					</Transition>
				)}

				{step === 5 && (
					<Transition key="selfie" style="gap-10">
						<Selfie />
					</Transition>
				)}

				{step === 6 && (
					<Transition
						key="verify"
						style="flex-1 justify-center items-center"
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
					</Transition>
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

						return
					}

					if (step === 4) {
						await handleVerifySubmit()
						console.log("verify")
						//@ts-ignore
						next()

						return
					}

					handleNextStep()
					//@ts-ignore
					next()
				}}
			>
				{step < 3
					? translate("authPage.signUp.continueButton")
					: step === 3
						? translate("authPage.signUp.submitButton")
						: step === 4
							? translate("authPage.signUp.verifyButton")
							: translate("authPage.signUp.backToSignIn")}
			</ThemedAwesomeButton>
		</MotiView>
	)
}

export default SignUp
