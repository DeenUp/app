import { Text, View } from "react-native"

import { twMerge } from "tailwind-merge"

import { tw } from "~/utils"

type SeparatorProps = {
	children?: React.ReactNode
	className?: string
	color?: string
	thickness?: string
	textColor?: string
}

const Separator: React.FC<SeparatorProps> = ({
	children,
	className,
	color = "gray-300",
	thickness = "h-1",
	textColor = "gray-500",
}) => {
	return children ? (
		<View className={twMerge(tw`flex-row items-center`, className)}>
			<View
				className={twMerge(
					tw`${thickness} flex-1 rounded-xl bg-${color}`,
				)}
			/>
			<Text className={twMerge(tw`px-2 text-${textColor}`)}>
				{children}
			</Text>
			<View
				className={twMerge(
					tw`${thickness} flex-1 rounded-xl bg-${color}`,
				)}
			/>
		</View>
	) : (
		<View className={twMerge(tw`${thickness} bg-${color}`, className)} />
	)
}

export default Separator
