import { Text, View } from "react-native"
import { Avatar } from "react-native-paper"

import LottieView from "lottie-react-native"
import { MotiView } from "moti"
import twr from "twrnc"

import type { GameStore, SettingsStore } from "~/stores"

import crown from "~/assets/lottie/player-crown.json"
import { useGameStore, useSettingsStore } from "~/stores"

import { Button } from "../ui"

const Scores = () => {
	const theme = useSettingsStore((state: SettingsStore) => state.theme)
	const { loading, nextRound } = useGameStore((state: GameStore) => ({
		loading: state.loading,
		error: state.error,
		nextRound: state.nextRound.bind(state),
	}))

	const players = [
		{ name: "Player 1", score: 0, color: theme.colors.surface },
		{ name: "Player 2", score: 10, color: theme.colors.accent },
		{ name: "Player 3", score: 0, color: theme.colors.surface },
		{ name: "Player 4", score: 0, color: theme.colors.surface },
	]

	const styles = {
		roundResult: twr`mt-50 flex h-[90%] w-[98%] flex-col items-center justify-start gap-6 rounded-md rounded-xl bg-gray-100 px-3 py-6 shadow-md`,
		playerScoreContainer: twr`flex w-full flex-row items-center justify-start gap-4 rounded-2xl bg-white p-4 shadow`,
		crownIcon: twr`absolute bottom-4 right-0 my-2 mr-4 h-12 w-12`,
		roundResultText: twr`text-center text-3xl font-bold`,
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
			<View
				//Purple dot at the left corner
				className="absolute top-0 size-2 rounded-full bg-primary"
			/>

			{players.map((player, index) => (
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
							backgroundColor: player.color,
						}}
					/>
					<View style={styles.playerDetails}>
						<Text style={styles.playerName}>{player.name}</Text>
						<Text style={styles.playerScore}>{player.score}</Text>
					</View>
					{player.score == 10 && (
						<LottieView
							source={crown}
							autoPlay
							loop={false}
							style={styles.crownIcon}
						/>
					)}
				</MotiView>
			))}
			<Button
				isLoading={loading}
				label="Next Round"
				onPress={() => nextRound()}
				color="primary"
				buttonStyle="shadow-md px-6 mt-2 w-2/3"
				size="lg"
			/>
		</MotiView>
	)
}

export default Scores
