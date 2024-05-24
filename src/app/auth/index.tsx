import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Text,
	TouchableWithoutFeedback,
	View,
} from "react-native"

import { StatusBar } from "expo-status-bar"

import { AnimatePresence, MotiView } from "moti"
import twr from "twrnc"

import { AuthHeader, ForgotPassword, SignIn, SignUp } from "~/components/auth"
import { tw } from "~/helpers"
import { useAuthStore } from "~/stores"

export default function Auth() {
	const { isSignUp, isForgotPassword } = useAuthStore()

	const styles = {
		header: tw`h-1/2 flex-1 items-center justify-center bg-primary`,
		logo: tw`text-6xl font-bold text-base-100`,
		closeButton: tw`absolute right-10 top-12 size-10`,
		motiStyle: twr`relative w-full flex-col items-center justify-start  overflow-hidden rounded-t-3xl bg-[#F9FAFB] p-4 shadow-sm`,
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				style={twr`flex-1 bg-[#6D28D9]`}
				behavior={Platform.OS === "ios" ? "padding" : "padding"}
			>
				<StatusBar style="light" />

				<View className={styles.header}>
					{!isSignUp && !isForgotPassword && (
						<Text className={styles.logo}>DeenUp</Text>
					)}
				</View>

				<MotiView
					delay={200}
					from={{ height: "0%" }}
					animate={{
						height: isSignUp || isForgotPassword ? "98%" : "60%",
					}}
					style={styles.motiStyle}
				>
					<AnimatePresence>
						{(isSignUp || isForgotPassword) && (
							<MotiView
								style={{
									height: "22%",
									width: "100%",
									gap: 24,
								}}
								from={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								delay={700}
								key="authHeader"
							>
								<AuthHeader
									key={isSignUp ? "signup" : "forgotpassword"}
								/>
							</MotiView>
						)}
						{isSignUp && <SignUp />}
						{isForgotPassword && <ForgotPassword />}
						{!isSignUp && !isForgotPassword && <SignIn />}
					</AnimatePresence>
				</MotiView>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	)
}
