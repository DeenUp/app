import type { User } from "node_modules/@deenup/store/src/graphql/api"

import React from "react"
import { Text, View } from "react-native"

import PlayerAvatar from "./PlayerAvatar"

type Props = {
	users: User[]
}

const ParticipantsList = ({ users }: Props) => (
	<View className="flex items-center justify-center gap-12">
		<Text className="text-xl font-semibold">Participants</Text>
		<View className="flex flex-row items-center justify-center gap-8">
			{users.map((user) => (
				<PlayerAvatar
					key={user.id}
					name={user.name}
					selfie={user.selfie}
					color={"#6D28D9"}
					size={60}
					className="flex items-center gap-2"
				/>
			))}
		</View>
	</View>
)

export default ParticipantsList
