import type { UserSlice } from "./user.slice"

import createUserSlice from "./user.slice"

type UserStore = UserSlice

export type { UserSlice, UserStore }
export { createUserSlice }
