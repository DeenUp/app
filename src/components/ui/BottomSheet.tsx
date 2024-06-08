import type { FC } from "react"

import React, { useCallback, useMemo, useRef } from "react"
import { Button, StyleSheet, Text, View } from "react-native"

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"

const BottomSheetModal: FC = () => {
	const bottomSheetModalRef = useRef<BottomSheet>(null)

	const snapPoints = useMemo(() => ["25%", "50%"], [])

	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.expand
	}, [])

	return (
		<>
			<Button title="Test" onPress={() => handlePresentModalPress()} />
			<BottomSheet
				index={1}
				style={{ backgroundColor: "red" }}
				ref={bottomSheetModalRef}
				snapPoints={snapPoints}
			>
				<BottomSheetView style={{ backgroundColor: "red" }}>
					<View style={styles.container}>
						<Text>Awesome 🎉</Text>
					</View>
				</BottomSheetView>
			</BottomSheet>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
})

export default BottomSheetModal
