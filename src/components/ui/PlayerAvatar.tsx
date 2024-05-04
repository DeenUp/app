import React from "react"
import { Text } from "react-native"
import { Avatar } from "react-native-paper"

import { View } from "moti"
import twr from "twrnc"

type Props = {
	name: string
	selfie: string | null | undefined
	color: string
	size: number
	className: string
}

const PlayerAvatar = ({ name, selfie, color, size, className }: Props) => {
	return (
		<View
			from={{
				scale: 0,
			}}
			animate={{
				scale: 1,
			}}
			exit={{
				scale: 0,
			}}
			style={twr`${className}`}
		>
			{selfie ? (
				<Avatar.Image
					size={size}
					source={{ uri: selfie }}
					style={{
						backgroundColor: color,
					}}
				/>
			) : (
				<Avatar.Icon
					size={size}
					icon="account"
					style={{
						backgroundColor: color,
					}}
				/>
			)}
			<View>
				<Text>{name}</Text>
			</View>
		</View>
	)
}

export default PlayerAvatar
