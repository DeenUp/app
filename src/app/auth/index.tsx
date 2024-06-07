import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	View,
} from "react-native"

import { StatusBar } from "expo-status-bar"

import DU from "~assets/app-icon/production/adaptive-foreground.png"
import { AnimatePresence, MotiImage, MotiView } from "moti"
import twr from "twrnc"

import { AuthHeader, ForgotPassword, SignIn, SignUp } from "~/components/auth"
import { tw } from "~/helpers"
import { useAuthStore } from "~/stores"

export default function Auth() {
	const { isSignUp, isForgotPassword } = useAuthStore()

	const styles = {
		header: tw`h-1/2 flex-1 items-center justify-center bg-[#472836]`,
		logo: twr`h-40 w-44`,
		closeButton: tw`absolute right-10 top-12 size-10`,
		motiStyle: twr`relative w-full flex-col items-center justify-start overflow-hidden rounded-t-[50px] bg-[#F9F2DF] p-4 shadow-sm`,
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				style={twr`flex-1 bg-[#472836]`}
				enabled={isSignUp || isForgotPassword ? false : true}
				behavior={Platform.OS === "ios" ? "height" : "height"}
			>
				<StatusBar style="light" />
				<View className={styles.header}>
					<MotiImage
						source={DU}
						style={styles.logo}
						animate={
							isSignUp || isForgotPassword
								? twr`h-11 w-12`
								: twr`h-40 w-44`
						}
						delay={200}
					/>
				</View>

				<MotiView
					delay={200}
					from={{ height: "0%" }}
					animate={{
						height: isSignUp || isForgotPassword ? "92%" : "70%",
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
