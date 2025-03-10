import { useState } from "react"
import { Text, View } from "react-native"

import { StatusBar } from "expo-status-bar"

import LottieView from "lottie-react-native"

import { lottieBlueCheck } from "~/assets/"
import { Verify } from "~/components/auth/"
import { Button } from "~/components/ui"
import { useAuthStore, useSettingsStore } from "~/stores"
import { tw } from "~/utils"

export default function Auth() {
	const translate = useSettingsStore((state) => state.translate)

	const { username, loading, handleConfirmSignUp } = useAuthStore()

	const [isVerified, setVerified] = useState(false)

	const styles = {
		body: tw`bg-base-200 h-full w-full flex-col items-center justify-start gap-6 p-6 pt-24`,
		headerContainer: tw`items-center justify-center gap-4`,
		header: tw`text-4xl font-bold`,
		subheader: tw`text-lg font-light text-gray-500`,
		logo: tw`text-base-100 text-2xl font-bold`,
		closeButton: tw`absolute right-5 top-5 size-10`,
		submitButton: tw`absolute bottom-12 w-11/12`,
	}

	const handleVerifySubmit = async () => {
		await handleConfirmSignUp({
			onSuccess: () => {
				setVerified(true)
			},
		})
	}

	return (
		<>
			<StatusBar style="light" />
			<View className={styles.body}>
				<View className={styles.headerContainer}>
					<Text className={styles.header}>
						{translate("authPage.verify.header")}
					</Text>
					<Text className={styles.subheader}>
						{translate("authPage.verify.subheader", {
							email: username,
						})}
					</Text>
				</View>
				{isVerified ? (
					<LottieView
						source={lottieBlueCheck}
						loop={false}
						autoPlay
						style={{
							width: 300,
							height: 500,
						}}
					/>
				) : (
					<Verify />
				)}

				<Button
					label={translate("authPage.verify.submitButton")}
					color="primary"
					size="xl"
					buttonStyle={styles.submitButton}
					onPress={() => handleVerifySubmit()}
					isLoading={loading}
				/>
			</View>
		</>
	)
}
