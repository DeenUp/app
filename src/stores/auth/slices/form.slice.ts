import type { StateCreator } from "zustand"

import type { AuthStore } from "."

import { forgotPasswordSteps, signUpSteps } from "~/constants"
import { validateEmail, validateName, validatePassword } from "~/utils"

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
			if (get().loading) return

			set({
				error: null,
				errors: {
					name: "",
					email: "",
					password: "",
					confirmPassword: "",
				},
			})

			if (get().isSignUp) {
				switch (get().step) {
					case 1:
						set({
							errors: {
								...get().errors,
								name: validateName(get().name!),
							},
						})
						break
					case 2:
						set({
							errors: {
								...get().errors,
								email: validateEmail(get().username!),
							},
						})
						break
					case 3:
						set({
							errors: {
								...get().errors,
								password: validatePassword(get().password!),
							},
						})
				}

				if (Object.values(get().errors).some((error) => error)) {
					return
				}

				if (get().step === 4 && get().error) return

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
				},
				isSignUp: false,
				isForgotPassword: false,
				name: "",
				username: "",
				password: "",
			})
		},
	}
}

export default createFormSlice
