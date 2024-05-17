import { Text, View } from "react-native"

import type { GameStore } from "~/stores"

import { useGameStore } from "~/stores"

import PlayerAvatar from "./PlayerAvatar"

const ParticipantsList = () => {
	const { participants, isCreator } = useGameStore((state: GameStore) => ({
		participants: state.participants,
		isCreator: state.isCreator,
	}))

	return (
		<View className="flex items-center justify-center gap-12">
			<View className="flex items-center justify-center gap-4">
				{isCreator ? (
					participants.length == 0 ? (
						<Text className="text-primary-500 text-center text-lg">
							Waiting for players to join...
						</Text>
					) : (
						<Text className="text-primary-500 text-center text-lg">
							Start Game or wait for more players to join...
						</Text>
					)
				) : (
					<Text className="text-primary-500 text-center text-lg">
						Waiting for host to start game...
					</Text>
				)}
			</View>
			<View className="flex flex-row items-center justify-center gap-8">
				{participants.map(({ user }) => (
					<PlayerAvatar
						key={user.id}
						name={user.name}
						selfie={user.selfie}
						color={"#6D28D9"}
						size={60}
						className="flex items-center justify-center gap-4"
					/>
				))}
			</View>
		</View>
	)
}

export default ParticipantsList
