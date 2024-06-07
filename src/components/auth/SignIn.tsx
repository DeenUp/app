import { useState } from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { useModal } from "react-native-modalfy"

import * as Haptics from "expo-haptics"
import { router } from "expo-router"

import { MotiView } from "moti"
import twr from "twrnc"

import googleLogo from "~/assets/images/google-logo.png"
import {
	Button,
	EmailInputField,
	PasswordInputField,
	ThemedAwesomeButton,
} from "~/components/ui"
import { tw } from "~/helpers"
import { useAuthStore, useSettingsStore } from "~/stores"

const SignIn = () => {
	const translate = useSettingsStore((state) => state.translate)
	const { openModal } = useModal()

	const {
		email,
		password,
		error,
		handleSignIn,
		setUsername,
		setPassword,
		clear,
		setIsSignUp,
		setIsForgotPassword,
	} = useAuthStore((state) => ({
		setName: state.setName,
		setUsername: state.setUsername,
		setPassword: state.setPassword,
		handleSignIn: state.handleSignIn,
		clear: state.clear,
		email: state.username,
		name: state.name,
		password: state.password,
		error: state.error,
		setIsSignUp: state.setIsSignUp,
		setIsForgotPassword: state.setIsForgotPassword,
	}))

	const [errors, setErrors] = useState({
		email: "",
		password: "",
	})

	const styles = {
		footer: tw` flex h-8 flex-row items-center justify-center gap-1`,
		signUpText: tw`font-bold text-primary`,
	}

	const handleSubmit = async () => {
		const newErrors = {
			email: email ? "" : translate("authPage.alerts.emailRequired"),
			password: password
				? ""
				: translate("authPage.alerts.passwordRequired"),
		}
		setErrors(newErrors)

		if (Object.values(newErrors).some((error) => error !== "")) {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

			return
		}
		await handleSignIn({
			onVerificationRequired: () => {
				router.push("/auth/verification")
			},
			onSuccess: () => {
				openModal("SuccessModal", {
					title: translate("notifications.signIn.success.title"),
					message: translate("notifications.signIn.success.message"),
					origin: "signin",
					onConfirm: () => {
						router.dismissAll()
					},
				})
				Haptics.notificationAsync(
					Haptics.NotificationFeedbackType.Success,
				)
			},
		})
	}

	const handleInputChange = (field: string, value: string) => {
		if (error) clear()

		if (field === "password" && value === "Enter") {
			return
		}

		switch (field) {
			case "email":
				setUsername(value)
				break
			case "password":
				setPassword(value)
				break
		}
	}

	return (
		<MotiView
			key="signin"
			animate={{ opacity: 1 }}
			exit={{
				opacity: 0,
			}}
			from={{ opacity: 0 }}
			delay={500}
			exitTransition={{ delay: 0 }}
			style={twr`flex flex-col items-center justify-center gap-4`}
			onDidAnimate={() => {
				Haptics.notificationAsync(
					Haptics.NotificationFeedbackType.Success,
				)
			}}
		>
			<View className="gap-8">
				<EmailInputField
					value={email}
					error={error ? (error as string) : errors.email}
					onChangeText={(value) => handleInputChange("email", value)}
				/>

				<PasswordInputField
					value={password}
					error={errors.password}
					onChangeText={(value) =>
						handleInputChange("password", value)
					}
				/>
			</View>

			<Button
				buttonStyle=""
				color="link"
				size="md"
				label={translate("authPage.signIn.forgotPassword")}
				onPress={() => setIsForgotPassword(true)}
			/>
			<ThemedAwesomeButton
				width={350}
				height={70}
				textSize={20}
				type="anchor"
				onPress={async (next) => {
					await handleSubmit().then(() => {
						//@ts-ignore
						next()
					})
				}}
				progress
			>
				Sign In
			</ThemedAwesomeButton>
			{/* Seperator with text in between */}
			<View className="flex flex-row items-center gap-4">
				<View className="h-1 flex-1 bg-gray-300" />
				<Text className="text-gray-500">or</Text>
				<View className="h-1 flex-1 bg-gray-300" />
			</View>

			<View className="flex flex-row items-center gap-4">
				<ThemedAwesomeButton
					width={350}
					textSize={16}
					type="anchor"
					onPress={() => {}}
					before={
						<Image source={googleLogo} style={twr`mr-4 h-6 w-6`} />
					}
					paddingHorizontal={40}
				>
					Continue with Google
				</ThemedAwesomeButton>
			</View>
			<View className={styles.footer}>
				<Text>{translate("authPage.signIn.noAccount")}</Text>
				<TouchableOpacity onPress={() => setIsSignUp(true)}>
					<Text className={styles.signUpText}>
						{translate("authPage.signIn.signUp")}
					</Text>
				</TouchableOpacity>
			</View>
		</MotiView>
	)
}

export default SignIn
