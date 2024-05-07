import type { Dispatch, SetStateAction } from "react"

import { useState } from "react"

import LottieView from "lottie-react-native"
import { AnimatePresence, MotiView } from "moti"

import { lottieBlueCheck } from "~/assets"
import Verify from "~/components/auth/Verify"
import { Button, EmailInputField, PasswordInputField } from "~/components/ui"
import { useAuthStore, useSettingsStore } from "~/stores"

type Props = {
	step: number
	setStep: Dispatch<SetStateAction<States>>
	onBackPress: () => void
}

type States = {
	isSignUp: boolean
	isForgotPassword: boolean
	step: number
}

const ForgotPassword = ({ step, setStep, onBackPress }: Props) => {
	const translate = useSettingsStore((state) => state.translate)
	const { email, password, passwordConfirm, setUsername, setPassword } =
		useAuthStore((state) => ({
			setName: state.setName,
			setUsername: state.setUsername,
			setPassword: state.setPassword,
			handleResetPassword: state.handleResetPassword,
			email: state.username,
			name: state.name,
			password: state.password,
			passwordConfirm: state.setPassword,
		}))
	const [code, setCode] = useState("")
	const [isSubmiting, setSubmitting] = useState(false)

	const [errors, setErrors] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		code: "",
	})

	const handleSubmit = () => {
		const newErrors = {
			email: step === 0 && !email ? "Email is required" : "",
			code: step === 1 && !code ? "Code is required" : "",
			password: step === 2 && !password ? "Password is required" : "",
			confirmPassword:
				step === 2 && (!passwordConfirm || password !== password)
					? "Passwords do not match"
					: "",
		}

		setErrors(newErrors)

		if (Object.values(newErrors).some((error) => error !== "")) {
			return
		}

		setSubmitting(true)
		setTimeout(() => {
			setStep((prevState) => ({
				...prevState,
				step: prevState.step + 1,
			}))

			setSubmitting(false)
		}, 1000)
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
				setCode(value)
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
			style={{
				gap: 150,
				width: "100%",
				flex: 1,
				justifyContent: "space-between",
				paddingBottom: 10,
			}}
		>
			<AnimatePresence>
				{step === 0 && (
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
				{step === 1 && (
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

			<Button
				buttonStyle="w-full"
				color="primary"
				size="xl"
				isLoading={isSubmiting}
				label={
					step === 0
						? translate("authPage.forgotPassword.requestReset")
						: step === 1
							? translate("authPage.verify.submitButton")
							: step === 2
								? translate(
										"authPage.forgotPassword.submitButton",
									)
								: translate(
										"authPage.forgotPassword.backToSignIn",
									)
				}
				onPress={step === 3 ? onBackPress : handleSubmit}
			/>
		</MotiView>
	)
}

export default ForgotPassword