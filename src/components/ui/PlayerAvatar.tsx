import React from "react"
import { Text, TouchableOpacity } from "react-native"
import { Avatar } from "react-native-paper"

import { View } from "moti"
import twr from "twrnc"

type Props = {
	name?: string
	selfie?: string | null | undefined
	color: string
	size: number
	className: string
	onPress?: () => void
}

const PlayerAvatar = ({
	name,
	selfie,
	color,
	size,
	className,
	onPress,
}: Props) => {
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
			<TouchableOpacity className="gap-4" onPress={onPress}>
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
				<View className="flex items-center justify-center">
					<Text>{name}</Text>
				</View>
			</TouchableOpacity>
		</View>
	)
}

export default PlayerAvatar
