import type { AuthStore } from "./auth/slices";
import type { GameStore } from "./game/slices";
import type { UserStore } from "./user/slices";

import useAuthStore from "./auth/useAuthStore";
import useGameStore from "./game/useGameStore";
import useUserStore from "./user/useUserStore";

export { useGameStore, useUserStore, useAuthStore };
export type { AuthStore, GameStore, UserStore };
