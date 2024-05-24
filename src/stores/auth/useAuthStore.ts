import { create } from "zustand"

import type { AuthStore } from "./slices"

import { createAuthSlice, createFormSlice } from "./slices"

const useAuthStore = create<AuthStore>()((...a) => ({
	...createAuthSlice(...a),
	...createFormSlice(...a),
}))

export default useAuthStore
