import type { ReactNode } from "react"

import { Pressable, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { Link, router, Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"

import AntIcons from "@expo/vector-icons/AntDesign"
import LottieView from "lottie-react-native"

import type { GameStore } from "~/stores"

import Trophy from "~/assets/lottie/result-trophy.json"
import { Button } from "~/components/ui"
import { useGameStore } from "~/stores"
import { tw } from "~/utils"

type StatItemProps = {
	styles: {
		container: string
		header: string
		value: string
	}
	label: string
	value: string | number
}

export default function Page(): ReactNode {
	const styles = {
		body: tw`flex size-full flex-col items-center justify-around`,
		headerContainer: tw`flex w-full flex-row items-end justify-between p-4`,
		headerText: tw`ml-6 text-2xl font-bold`,
		statsContainer: tw`mt-96 flex w-full flex-row items-center justify-center px-10`,
		bottomButtonsContainer: tw`flex h-14 flex-row gap-3 px-12`,
		checkAnswersButton: tw`absolute bottom-4 mx-12 w-3/4 rounded-xl`,
		shareButton: tw`flex size-16 items-center justify-center rounded-3xl border-4 border-gray-300`,
		animationContainer: tw`absolute -z-10 flex size-full items-center justify-start`,
		animationContainerBackground: tw`absolute top-40 size-96 rounded-3xl bg-primary`,
		statItem: {
			container: tw`mb-6 flex items-start gap-4`,
			header: tw`text-base font-semibold text-gray-400`,
			value: tw`text-2xl font-bold`,
		},
		doneButton: tw`w-3/4`,
	}
	const questions = useGameStore((state: GameStore) => state.questions)
	const correctQuestions = useGameStore(
		(state: GameStore) => state.correctQuestions,
	)
	const incorrectQuestions = useGameStore(
		(state: GameStore) => state.incorrectQuestions,
	)
	const skippedQuestions = useGameStore(
		(state: GameStore) => state.skippedQuestions,
	)
	const resetSoloSession = useGameStore(
		(state: GameStore) => state.resetSoloSession,
	)

	const totalQuestions = questions.length

	return (
		<SafeAreaView>
			<Stack.Screen options={{ title: "Results" }} />
			<StatusBar style="dark" />
			<View className={styles.animationContainer}>
				<View className={styles.animationContainerBackground}>
					<Button
						buttonStyle={styles.checkAnswersButton}
						size="lg"
						label="Check Correct Answer"
						color="accent"
						onPress={() => {
							router.push("/")
						}}
					/>
				</View>
				<LottieView
					source={Trophy}
					loop={false}
					autoPlay
					style={{
						width: 500,
						height: 500,
						aspectRatio: "auto",
					}}
				/>
			</View>
			<View className={styles.body}>
				<View className={styles.headerContainer}>
					<View></View>
					<Text className={styles.headerText}>Congratulations!</Text>
					<Link href="/" asChild>
						<Pressable>
							<AntIcons name="close" color={"indigo"} size={25} />
						</Pressable>
					</Link>
				</View>

				<View className={styles.statsContainer}>
					<View className="w-1/2 ">
						<StatItem
							styles={styles.statItem}
							label="CORRECT ANSWER"
							value={correctQuestions.length + " questions"}
						/>
						<StatItem
							styles={styles.statItem}
							label="SKIPPED"
							value={skippedQuestions.length}
						/>
					</View>
					<View className="w-1/2">
						<StatItem
							styles={styles.statItem}
							label="TOTAL QUESTIONS"
							value={totalQuestions}
						/>

						<StatItem
							styles={styles.statItem}
							label="INCORRECT ANSWER"
							value={incorrectQuestions.length + " questions"}
						/>
					</View>
				</View>
				<View className={styles.bottomButtonsContainer}>
					<Button
						buttonStyle={styles.doneButton}
						color="primary"
						size="lg"
						label="Done"
						onPress={() => {
							resetSoloSession()
							router.push("/")
						}}
					/>

					<Pressable className={styles.shareButton}>
						<AntIcons name="sharealt" color={"black"} size={25} />
					</Pressable>
				</View>
			</View>
		</SafeAreaView>
	)
}

const StatItem: React.FC<StatItemProps> = ({ styles, label, value }) => (
	<View className={styles.container}>
		<Text className={styles.header}>{label}</Text>
		<Text className={styles.value}>{value}</Text>
	</View>
)
