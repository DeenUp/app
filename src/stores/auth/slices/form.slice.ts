import type { StateCreator } from "zustand"

import type { AuthStore } from "."

import { forgotPasswordSteps, signUpSteps } from "~/constants"

type FormState = {
	step: number
	completed: boolean
	loading: boolean
	error: string | null
	isSignUp: boolean
	isForgotPassword: boolean
	steps: Record<number, { header: string; subheader: string }> | null
}

type FormActions = {
	setIsSignUp: (isSignUp: boolean) => void
	setIsForgotPassword: (isForgotPassword: boolean) => void
	setStep: (step: number) => void
	handleNextStep: () => void
	handlePrevStep: () => void
	handleReset: () => void
}

export type FormSlice = FormState & FormActions

const createFormSlice: StateCreator<AuthStore, [], [], FormSlice> = (set) => {
	return {
		step: 0,
		completed: false,
		loading: false,
		error: null,
		isSignUp: false,
		isForgotPassword: false,
		steps: null,

		setStep: (step) => {
			set({ step })
		},

		setIsSignUp: (isSignUp) => {
			set({ isSignUp, steps: signUpSteps })
		},

		setIsForgotPassword: (isForgotPassword) => {
			set({ isForgotPassword, steps: forgotPasswordSteps })
		},

		handleNextStep: () => {
			set((state) => ({ step: state.step + 1 }))
		},

		handlePrevStep: () => {
			set((state) => ({ step: state.step - 1 }))
		},

		handleReset: () => {
			set({
				step: 0,
				completed: false,
				loading: false,
				error: null,
				isSignUp: false,
				isForgotPassword: false,
			})
		},
	}
}

export default createFormSlice
