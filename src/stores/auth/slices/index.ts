import type { AuthSlice } from "./auth.slice"
import type { FormSlice } from "./form.slice"

import createAuthSlice from "./auth.slice"
import createFormSlice from "./form.slice"

type AuthStore = AuthSlice & FormSlice

export type { AuthSlice, AuthStore, FormSlice }
export { createAuthSlice, createFormSlice }
