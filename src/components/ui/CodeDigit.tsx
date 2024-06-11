import { ActivityIndicator } from "react-native-paper"

import { MotiText } from "moti"
import twr from "twrnc"

import { useSettingsStore } from "~/stores"

import ThemedAwesomeButton from "./AwesomeButton"

type CodeComponentProps = {
	digit?: string | null
	onPress?: () => void
}

export const CodeDigitBox: React.FC<CodeComponentProps> = ({
	digit,
	onPress,
}) => {
	const { theme } = useSettingsStore()

	const styles = {
		codeText: twr`text-xl font-bold`,
	}

	return (
		<ThemedAwesomeButton
			theme="bruce"
			width={56}
			borderColor={theme.primary}
			backgroundColor={theme.background}
			paddingBottom={2}
			raiseLevel={digit ? 4 : 0}
			style={twr`mx-1`}
			onPress={onPress}
		>
			{digit ? (
				<MotiText
					from={{
						opacity: 0,
						translateY: 20,
					}}
					animate={{
						opacity: 1,
						translateY: 0,
					}}
					transition={{
						type: "timing",
						duration: 100,
					}}
					style={styles.codeText}
				>
					{digit}
				</MotiText>
			) : (
				<ActivityIndicator
					style={twr`flex-1`}
					color={"black"}
					size="small"
				/>
			)}
		</ThemedAwesomeButton>
	)
}
