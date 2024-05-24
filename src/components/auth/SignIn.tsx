import React, { useState } from "react"
import { Alert, Text, TouchableOpacity, View } from "react-native"

import { router } from "expo-router"

import { MotiView } from "moti"

import { Button, EmailInputField, PasswordInputField } from "~/components/ui"
import { tw } from "~/helpers"
import { useAuthStore, useSettingsStore } from "~/stores"

const SignIn = () => {
	const translate = useSettingsStore((state) => state.translate)
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
	const { loading } = useAuthStore()

	const [errors, setErrors] = useState({
		email: "",
		password: "",
	})

	const styles = {
		footer: tw`flex h-8 w-full flex-row items-center justify-center gap-1`,
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
			return
		}
		await handleSignIn({
			onVerificationRequired: () => {
				router.push("/auth/verification")
			},
			onSuccess: () => {
				Alert.alert("Signed In", "Welcome back", [
					{
						text: "Confirm",
						onPress: () => {
							clear()
							router.dismissAll()
						},
					},
				])
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
			style={{ width: "100%", gap: 10 }}
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
			<Button
				buttonStyle="w-full"
				color="primary"
				size="xl"
				label={"Sign In"}
				onPress={handleSubmit}
				isLoading={loading}
			/>
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
