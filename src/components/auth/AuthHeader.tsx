import { Text, TouchableOpacity, View } from "react-native"

import { MaterialCommunityIcons } from "@expo/vector-icons"

import { SegmentedProgressBar } from "~/components/ui"
import { tw } from "~/helpers"
import { useAuthStore, useSettingsStore } from "~/stores"

const AuthHeader = () => {
	const translate = useSettingsStore((state) => state.translate)
	const {
		name,
		username,
		step,
		steps,
		isSignUp,
		handlePrevStep,
		handleReset,
	} = useAuthStore()

	const currentStep = steps![step]!

	const styles = {
		body: tw`flex w-full gap-6 px-6`,
		backButton: tw`size-10`,
		buttonsContainer: tw`flex flex-row justify-between`,
		textContainer: tw``,
		headerText: tw`text-4xl font-extrabold`,
		subheaderText: tw`text-gray-500`,
	}

	return (
		<View className={styles.body}>
			<View className={styles.buttonsContainer}>
				<TouchableOpacity
					className={styles.backButton}
					onPress={
						step === 1
							? () => {
									handleReset()
								}
							: () => handlePrevStep()
					}
				>
					<MaterialCommunityIcons
						name="chevron-left"
						color={"black"}
						size={31}
					/>
				</TouchableOpacity>
			</View>
			<SegmentedProgressBar
				progress={step / (isSignUp ? 5 : 3)}
				segments={isSignUp ? 5 : 3}
				color="#472836"
				backgroundColor="#7E6972"
			/>
			<View className={styles.textContainer}>
				<Text className={styles.headerText}>
					{translate(currentStep.header)}
				</Text>
				<Text className={styles.subheaderText}>
					{step === 1 && isSignUp
						? translate(currentStep.subheader, { name })
						: step === 3 && isSignUp
							? translate(currentStep.subheader, { username })
							: translate(currentStep.subheader)}
				</Text>
			</View>
		</View>
	)
}

export default AuthHeader
