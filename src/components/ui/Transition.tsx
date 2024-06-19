import { MotiView } from "moti"
import twr from "twrnc"

import { cn } from "~/utils"

const Transition = ({
	children,
	style,
}: {
	children: React.ReactNode
	style?: string
}) => {
	const styles = twr`${cn(style, `flex-1 items-center justify-between`)}`

	return (
		<MotiView
			from={{ opacity: 0, translateX: -20 }}
			animate={{ opacity: 1, translateX: 0 }}
			exit={{ opacity: 0, translateX: 20 }}
			transition={{ type: "timing", duration: 300 }}
			style={styles}
		>
			{children}
		</MotiView>
	)
}

export default Transition
