import type { StateCreator } from "zustand"

import type { AuthStore } from "."

import { forgotPasswordSteps, signUpSteps } from "~/constants"
import {
	validateCode,
	validateEmail,
	validateName,
	validatePassword,
} from "~/utils"

type FormState = {
	step: number
	completed: boolean
	loading: boolean
	error: string | null
	isSignUp: boolean
	isForgotPassword: boolean
	steps: Record<number, { header: string; subheader: string }> | null
	errors: {
		name: string
		email: string
		password: string
		confirmPassword: string
		code: string
	}
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

const createFormSlice: StateCreator<AuthStore, [], [], FormSlice> = (
	set,
	get,
) => {
	return {
		step: 1,
		completed: false,
		loading: false,
		error: null,
		isSignUp: false,
		isForgotPassword: false,
		steps: null,
		errors: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			code: "",
		},

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
			if (get().isSignUp) {
				const newErrors = {}
				switch (get().step) {
					case 1:
						validateName(get().name!)
						break
					case 2:
						validateEmail(get().username!)
						break
					case 3:
						validatePassword(get().password!)
						break
					case 4:
						validateCode(get().confirmationCode!)
						break
				}

				set((state) => ({ errors: { ...state.errors, ...newErrors } }))

				if (Object.values(newErrors).some((error) => error)) {
					return
				}

				set((state) => ({ step: state.step + 1 }))
			}

			if (get().isForgotPassword) {
				const newErrors = {}

				set((state) => ({ errors: { ...state.errors, ...newErrors } }))

				if (Object.values(newErrors).some((error) => error)) {
					return
				}

				set((state) => ({ step: state.step + 1 }))
			}
		},

		handlePrevStep: () => {
			set((state) => ({ step: state.step - 1 }))
		},

		handleReset: () => {
			set({
				step: 1,
				completed: false,
				loading: false,
				error: null,
				errors: {
					name: "",
					email: "",
					password: "",
					confirmPassword: "",
					code: "",
				},
				isSignUp: false,
				isForgotPassword: false,
			})
		},
	}
}

export default createFormSlice
