import { Text, View } from "react-native"
import { Avatar } from "react-native-paper"

import LottieView from "lottie-react-native"
import { MotiView } from "moti"
import twr from "twrnc"

import type { GameStore, SettingsStore } from "~/stores"

import crown from "~/assets/lottie/player-crown.json"
import { useGameStore, useSettingsStore } from "~/stores"

const Scores = () => {
	const theme = useSettingsStore((state: SettingsStore) => state.theme)

	const { participants, scores } = useGameStore((state: GameStore) => ({
		isCreator: state.isCreator,
		participants: state.participants,
		scores: state.scores,
		submittedAnswers: state.submittedAnswers,
		gameRound: state.gameRound,
		loading: state.loading,
		error: state.error,
		initializeGameRound: state.initializeGameRound,
	}))

	const styles = {
		roundResult: twr`mt-72 flex h-[80%] w-[98%] flex-grow flex-col items-center justify-start gap-6 rounded-md bg-gray-100 px-3 py-6 shadow-md`,
		playerScoreContainer: twr`flex w-full flex-row items-center justify-start gap-4 rounded-2xl bg-white p-4 shadow`,
		crownIcon: twr`absolute bottom-4 right-0 my-2 mr-4 h-12 w-12`,
		playerName: twr`text-lg font-semibold`,
		playerScore: twr`text-sm font-light text-gray-400`,
		playerDetails: twr`flex flex-col items-start justify-center gap-1`,
	}

	return (
		<MotiView
			key="round-result"
			style={styles.roundResult}
			from={{
				opacity: 0,
				translateY: 1000,
			}}
			animate={{
				opacity: 1,
				translateY: 0,
			}}
			exit={{
				opacity: 0,
				translateY: 0.2,
			}}
			transition={{
				type: "timing",
				duration: 1000,
			}}
			exitTransition={{
				type: "timing",
				duration: 20000,
			}}
		>
			<View className="absolute top-0 size-20 rotate-45 rounded-2xl bg-gray-100" />
			<View className="absolute top-0 size-2 rounded-full bg-primary" />

			{participants.map((participant, index) => (
				<MotiView
					key={index}
					style={styles.playerScoreContainer}
					from={{
						opacity: 0,
						translateX: -100,
					}}
					animate={{
						opacity: 1,
						translateX: 0,
					}}
					transition={{
						delay: index * 300,
						type: "timing",
						duration: 500,
					}}
					exit={{
						opacity: 0,
						translateX: -100,
					}}
					exitTransition={{
						type: "timing",
						duration: 500,
					}}
				>
					<Avatar.Icon
						size={60}
						icon="account"
						style={{
							backgroundColor: theme.colors.surface,
						}}
					/>
					<View style={styles.playerDetails}>
						<Text style={styles.playerName}>
							{participant.user.name}
						</Text>
						<Text style={styles.playerScore}>
							Score: {scores[participant.user.id] ?? 0}
						</Text>
					</View>

					{Object.values(scores).every(
						(score) => scores[participant.user.id]! >= score,
					) && (
						<LottieView
							source={crown}
							autoPlay
							loop={false}
							style={styles.crownIcon}
						/>
					)}
				</MotiView>
			))}
		</MotiView>
	)
}

export default Scores
