import type { ReactNode } from "react"

import { Text, View } from "react-native"

import type { AuthStore } from "~/stores"

import { Button } from "~/components/ui"
import { useAuthStore } from "~/stores"

export default function Page(): ReactNode {
	const { handleSignOut } = useAuthStore((store: AuthStore) => store)

	return (
		<View>
			<Text>Profile</Text>
			<Button onPress={handleSignOut} label="Sign Out" />
		</View>
	)
}
