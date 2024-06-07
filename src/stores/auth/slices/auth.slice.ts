import type { AuthError, AuthUser } from "aws-amplify/auth"
import type { StateCreator } from "zustand"

import {
	confirmResetPassword,
	confirmSignUp,
	getCurrentUser,
	resendSignUpCode,
	resetPassword,
	signIn,
	signInWithRedirect,
	signOut,
	signUp,
	updatePassword,
} from "aws-amplify/auth"
import { Hub } from "aws-amplify/utils"

import type { AuthStore } from "."

import * as API from "../../../graphql/api"
import useUserStore from "../../../stores/user/useUserStore"

type HubSubscription = ReturnType<typeof Hub.listen>

type AuthState = {
	name: string | null
	username: string | null
	password: string | null
	confirmationCode: string | null
	loading: boolean
	currentUser: AuthUser | null
	confirmationCodeSent: boolean
	error: string | null
}

type AuthActions = {
	handleGetCurrentUser: () => Promise<void>
	handleSignIn: (p: {
		onVerificationRequired: () => void
		onSuccess: () => void
	}) => Promise<void>
	handleSignInWithGoogle: () => Promise<void>
	handleSignOut: (p?: {
		global?: boolean
		onSignOut: () => void
	}) => Promise<void>
	handleSignUp: (p: { onVerificationRequired: () => void }) => Promise<void>
	handleConfirmSignUp: (p: { onSuccess: () => void }) => Promise<void>
	handleResendSignUpCode: (p: { username: string }) => Promise<void>
	handleUpdatePassword: (p: {
		oldPassword: string
		newPassword: string
	}) => Promise<void>
	handleResetPassword: () => Promise<void>
	handleConfirmResetPassword: () => Promise<void>
	setName: (name: string) => void
	setUsername: (email: string) => void
	setPassword: (password: string) => void
	setConfirmationCode: (confirmationCode: string) => void

	destroy: () => void
	clear: () => void
}

export type AuthSlice = AuthState & AuthActions

const createAuthSlice: StateCreator<AuthStore, [], [], AuthSlice> = (
	set,
	get,
) => {
	let authHubSubscription: HubSubscription | null = null

	const handleHubSubscriptions = () => {
		const authHubSubscription = Hub.listen(
			"auth",
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			async ({ payload: { event, message } }) => {
				switch (event) {
					case "signedIn":
					case "tokenRefresh":
					case "signInWithRedirect":
						await get().handleGetCurrentUser()
						break
					case "signedOut":
						useUserStore.getState().clearCurrentUser()
						break
					case "tokenRefresh_failure":
					case "signInWithRedirect_failure":
					case "customOAuthState":
						console.error(event, message)
						break
				}
			},
		)

		return authHubSubscription
	}

	void handleHubSubscriptions()

	return {
		name: null,
		username: null,
		password: null,
		confirmationCode: null,
		loading: false,
		currentUser: null,
		confirmationCodeSent: false,
		error: null,

		setName(name: string) {
			set({ name })
		},

		setUsername(username: string) {
			set({ username })
		},

		setPassword(password: string) {
			set({ password })
		},

		setConfirmationCode(confirmationCode: string) {
			set({ confirmationCode })
		},

		handleGetCurrentUser: async (): Promise<void> => {
			if (get().loading) return

			set({ loading: true, error: null })

			try {
				const currentUser = await getCurrentUser()

				await useUserStore.getState().setCurrentUser(currentUser.userId)

				set({ loading: false, currentUser: currentUser })
			} catch (error) {
				set({
					loading: false,
				})
			}
		},

		handleSignIn: async (p: {
			onVerificationRequired: () => void
			onSuccess: () => void
		}): Promise<void> => {
			if (get().loading) return

			set({ loading: true, error: null })
			const { username, password } = get()

			try {
				const { isSignedIn, nextStep } = await signIn({
					username: username!,
					password: password!,
				})

				let currentUser: AuthUser | null = null

				if (!isSignedIn) {
					currentUser = null
				}

				switch (nextStep.signInStep) {
					case "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE":
					case "CONFIRM_SIGN_IN_WITH_SMS_CODE":
					case "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED":
						set({
							loading: false,
							error: "Please sign in with new password",
						})
						break
					case "CONFIRM_SIGN_IN_WITH_TOTP_CODE":
					case "CONFIRM_SIGN_UP":
						p.onVerificationRequired()
						break
					case "CONTINUE_SIGN_IN_WITH_MFA_SELECTION":
					case "CONTINUE_SIGN_IN_WITH_TOTP_SETUP":
					case "RESET_PASSWORD":
						currentUser = null
						break
					case "DONE":
						currentUser = await getCurrentUser()
						await useUserStore
							.getState()
							.setCurrentUser(currentUser.userId)
						p.onSuccess()
				}

				set({ loading: false, currentUser: currentUser })
			} catch (error) {
				set({
					loading: false,
					error: (error as AuthError).message,
				})
			}
		},

		handleSignInWithGoogle: async (): Promise<void> => {
			if (get().loading) return

			set({ loading: true, error: null })

			try {
				await signInWithRedirect({ provider: "Google" })
			} catch (error) {
				set({
					loading: false,
					error: (error as AuthError).message,
				})
			}
		},

		handleSignOut: async (p?: {
			global?: boolean
			onSignOut: () => void
		}): Promise<void> => {
			if (get().loading) return

			set({ loading: true, error: null })

			try {
				await signOut()

				set({ loading: false, currentUser: null })

				p?.onSignOut()
			} catch (error) {
				set({
					loading: false,
					error: (error as AuthError).message,
				})
			}
		},

		handleSignUp: async (p: {
			onVerificationRequired: () => void
		}): Promise<void> => {
			if (get().loading) return

			set({ loading: true, error: null })

			const { name, username, password } = get()

			try {
				const { nextStep } = await signUp({
					username: username!,
					password: password!,
					options: {
						userAttributes: {
							name: name!,
							"custom:user_type": API.UserType.PLAYER,
						},
					},
				})

				set({ loading: false, confirmationCodeSent: true })

				switch (nextStep.signUpStep) {
					case "CONFIRM_SIGN_UP":
						p.onVerificationRequired()
						break
					case "COMPLETE_AUTO_SIGN_IN":
					case "DONE":
						break
				}
			} catch (error) {
				set({
					loading: false,
					error: (error as AuthError).message,
				})
			}
		},

		handleConfirmSignUp: async (p: {
			onSuccess: () => void
		}): Promise<void> => {
			if (get().loading) return

			set({ loading: true, error: null })
			const confirmationCode = get().confirmationCode

			if (!confirmationCode || confirmationCode?.length < 6) {
				set({ error: "Please enter a valid confirmation code" })

				return
			}

			try {
				const { nextStep } = await confirmSignUp({
					username: get().username!,
					confirmationCode: get().confirmationCode!,
				})

				set({ loading: false })

				switch (nextStep.signUpStep) {
					case "COMPLETE_AUTO_SIGN_IN":
					case "CONFIRM_SIGN_UP":
					case "DONE":
						p.onSuccess()
						break
				}
			} catch (error) {
				set({
					loading: false,
					error: (error as AuthError).message,
				})
			}
		},

		handleResendSignUpCode: async (p): Promise<void> => {
			if (get().loading) return

			set({ loading: true, error: null })

			try {
				await resendSignUpCode(p)

				set({ loading: false, confirmationCodeSent: true })
			} catch (error) {
				set({
					loading: false,
					error: (error as AuthError).message,
				})
			}
		},

		handleResetPassword: async (): Promise<void> => {
			if (get().loading) return

			set({ loading: true, error: null })

			try {
				const { isPasswordReset, nextStep } = await resetPassword({
					username: get().username!,
				})

				if (!isPasswordReset) {
					return
				}

				switch (nextStep.resetPasswordStep) {
					case "CONFIRM_RESET_PASSWORD_WITH_CODE":
					case "DONE":
						break
				}
			} catch (error) {
				set({
					loading: false,
					error: (error as AuthError).message,
				})
			}
		},

		handleConfirmResetPassword: async (): Promise<void> => {
			if (get().loading) return

			set({ loading: true, error: null })

			try {
				await confirmResetPassword({
					username: get().username!,
					confirmationCode: get().confirmationCode!,
					newPassword: get().password!,
				})

				set({ loading: false })
			} catch (error) {
				set({
					loading: false,
					error: (error as AuthError).message,
				})
			}
		},

		handleUpdatePassword: async (p): Promise<void> => {
			if (get().loading) return

			set({ loading: true, error: null })

			try {
				await updatePassword(p)

				set({ loading: false })
			} catch (error) {
				set({ loading: false, error: (error as AuthError).message })
			}
		},

		clear: () => {
			set({
				name: null,
				username: null,
				password: null,
				confirmationCode: null,
				loading: false,
				confirmationCodeSent: false,
				error: null,
			})
		},

		destroy: (): void => {
			if (authHubSubscription) {
				authHubSubscription()
				authHubSubscription = null
			}
		},
	}
}

export default createAuthSlice
