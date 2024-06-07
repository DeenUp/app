type Step = {
	header: string
	subheader: string
}

const signUpSteps: Record<number, Step> = {
	0: {
		header: "authPage.signUp.nameHeader",
		subheader: "authPage.signUp.nameSubheader",
	},
	1: {
		header: "authPage.signUp.emailHeader",
		subheader: "authPage.signUp.emailSubheader",
	},
	2: {
		header: "authPage.signUp.passwordHeader",
		subheader: "authPage.signUp.passwordSubheader",
	},
	3: {
		header: "authPage.verify.header",
		subheader: "authPage.verify.subheader",
	},
	4: {
		header: "Final Step",
		subheader: "Smile to the camera!",
	},
	5: {
		header: "authPage.signUp.successHeader",
		subheader: "authPage.signUp.successSubheader",
	},
}

const forgotPasswordSteps: Record<number, Step> = {
	0: {
		header: "authPage.forgotPassword.header",
		subheader: "authPage.forgotPassword.subheader",
	},
	1: {
		header: "authPage.verify.header",
		subheader: "authPage.verify.subheader",
	},
	2: {
		header: "authPage.forgotPassword.passwordHeader",
		subheader: "authPage.forgotPassword.passwordSubheader",
	},
	3: {
		header: "authPage.forgotPassword.successHeader",
		subheader: "authPage.forgotPassword.successSubheader",
	},
}

export { forgotPasswordSteps, signUpSteps }
