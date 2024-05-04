import type { ReactNode } from "react"

import { useEffect } from "react"

import type { AuthStore } from "~/stores"

import { useAuthStore } from "~/stores"

type Props = {
	children: React.ReactNode
}

export default function AmplifyProvider({ children }: Props): ReactNode {
	const handleGetCurrentUser = useAuthStore(
		(state: AuthStore) => state.handleGetCurrentUser,
	)

	useEffect(() => {
		void handleGetCurrentUser()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return <>{children}</>
}
