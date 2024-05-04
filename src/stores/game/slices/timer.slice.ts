import type { StateCreator } from "zustand"

import type { GameStore } from "."

type TimerStates = {
	seconds: number
	minutes: number
}

type TimerActions = {
	start: () => void
	countdown: () => void
	pause: () => void
	stop: () => void
	setTime: (minutes: number, seconds: number) => void
}

export type TimerSlice = TimerStates & TimerActions

const createTimerSlice: StateCreator<GameStore, [], [], TimerSlice> = (set) => {
	let intervalId: NodeJS.Timeout | undefined

	return {
		seconds: 0,
		minutes: 0,
		start: () => {
			intervalId = setInterval(() => {
				set((state) => {
					const newSeconds = state.seconds + 1
					const newMinutes = Math.floor(newSeconds / 60)

					return {
						...state,
						seconds: newSeconds % 60,
						minutes: state.minutes + newMinutes,
					}
				})
			}, 1000)
		},

		countdown: () => {
			intervalId = setInterval(() => {
				set((state) => {
					if (state.seconds === 0 && state.minutes === 0) {
						clearInterval(intervalId)

						return state
					}

					const newSeconds = state.seconds - 1
					const newMinutes = state.minutes - (newSeconds < 0 ? 1 : 0)

					return {
						...state,
						seconds: newSeconds < 0 ? 59 : newSeconds,
						minutes: newMinutes,
					}
				})
			}, 1000)
		},

		setTime: (minutes: number, seconds: number) => {
			set(() => ({
				minutes,
				seconds,
			}))
		},

		pause: () => clearInterval(intervalId),

		stop: () => {
			clearInterval(intervalId)
			set(() => ({
				seconds: 0,
				minutes: 0,
			}))
		},
	}
}

export default createTimerSlice
