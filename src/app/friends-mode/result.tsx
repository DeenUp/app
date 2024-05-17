import type { ReactNode } from "react"

import { Pressable, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { Link, router, Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"

import AntIcons from "@expo/vector-icons/AntDesign"
import { MotiView } from "moti"
import twr from "twrnc"

import type { GameStore, SettingsStore } from "~/stores"

import { Scores } from "~/components/gameplay"
import { Button } from "~/components/ui"
import { tw } from "~/helpers"
import { useGameStore, useSettingsStore } from "~/stores"

export default function Page(): ReactNode {
	const theme = useSettingsStore((state: SettingsStore) => state.theme)
	const { scores, participants } = useGameStore((state: GameStore) => state)

	const styles = {
		body: tw`flex size-full flex-col items-center justify-around`,
		headerContainer: tw`flex w-full flex-row items-end justify-between p-4`,
		headerText: tw`ml-6 text-xl font-bold text-white`,
		bottomButtonsContainer: tw`flex-stretch flex h-14 flex-row gap-3 px-12`,
		checkAnswersButton: tw`absolute bottom-4 mx-12 w-3/4 rounded-xl`,
		shareButton: tw`flex size-16 items-center justify-center rounded-3xl border-4 border-gray-300`,
		animationContainer: tw`absolute -z-10 flex size-full items-center justify-start`,
		animationContainerBackground: tw`absolute top-40 size-96 rounded-3xl bg-primary`,
		doneButton: tw`w-2/4`,
		roundResultText: tw`absolute top-24 text-center text-4xl font-semibold text-white`,
	}
	//Type 'Record<string, number>' must have a '[Symbol.iterator]()' method that returns an iterator.
	const highestScore = Math.max(...Object.values(scores))
	const winners = Object.keys(scores).filter(
		(key) => scores[key] === highestScore,
	)

	const roundResultText = participants.find((participant) => {
		return winners.includes(participant.id)
	})?.user.name

	return (
		<SafeAreaView
			style={{
				flex: 1,
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "flex-start",
				backgroundColor: theme.colors.primary,
			}}
		>
			<Stack.Screen options={{ title: "Results" }} />
			<StatusBar style="light" />

			<View className={styles.body}>
				<View className={styles.headerContainer}>
					<View></View>
					<Link href="/" asChild>
						<Pressable>
							<AntIcons name="close" color={"white"} size={25} />
						</Pressable>
					</Link>
				</View>

				<View>
					<Text className={styles.headerText}>Results</Text>

					<Text className={styles.roundResultText}>
						{roundResultText}
					</Text>
				</View>
				<Scores />
				<MotiView
					from={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ type: "timing", duration: 500 }}
					style={twr`absolute bottom-12 flex w-full flex-row items-center justify-center gap-4 px-6`}
				>
					<Button
						buttonStyle={styles.doneButton}
						color="accent"
						size="lg"
						label="Exit"
						onPress={() => {
							router.push("/")
						}}
					/>
					<Button
						buttonStyle={styles.doneButton}
						color="primary"
						size="lg"
						label="New Game"
						onPress={() => {
							router.push("/")
						}}
					/>

					{/* <Pressable className={styles.shareButton}>
						<AntIcons name="sharealt" color={"black"} size={25} />
					</Pressable> */}
				</MotiView>
			</View>
		</SafeAreaView>
	)
}
