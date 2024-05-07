import type { AuthStore } from "./auth/slices"
import type { GameStore } from "./game/slices"
import type { SettingsStore } from "./settings-store/slices"
import type { UserStore } from "./user/slices"

import useAuthStore from "./auth/useAuthStore"
import useGameStore from "./game/useGameStore"
import useSettingsStore from "./settings-store/useSettingsStore"
import useUserStore from "./user/useUserStore"

export type { AuthStore, GameStore, SettingsStore, UserStore }
export { useAuthStore, useGameStore, useSettingsStore, useUserStore }
