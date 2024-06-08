import { forwardRef, useCallback, useMemo } from "react"
import { View } from "react-native"

import { BottomSheetModal } from "@gorhom/bottom-sheet"

export const SelfieBottomSheetModal = forwardRef((props: any, ref: any) => {
	const snapPoints = useMemo(() => [1, 287], [])
	const handleSheetChanges = useCallback(() => {}, [])

	return (
		<BottomSheetModal
			ref={ref}
			index={1}
			snapPoints={snapPoints}
			// animationConfigs={animationConfigs}
			onChange={handleSheetChanges}
			handleIndicatorStyle={{
				backgroundColor: "#000",
				width: 40,
				height: 5,
			}}
			// backdropComponent={BottomSheetBackdrop}
			style={{ paddingHorizontal: 16 }}
		>
			<View
				style={{
					backgroundColor: "#fff",
					borderTopLeftRadius: 20,
					borderTopRightRadius: 20,
					padding: 16,
					height: "100%",
				}}
			>
				{props.content}
			</View>
		</BottomSheetModal>
	)
})
