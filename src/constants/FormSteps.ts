type Step = {
	header: string
	subheader: string
}

const signUpSteps: Record<number, Step> = {
	1: {
		header: "authPage.signUp.nameHeader",
		subheader: "authPage.signUp.nameSubheader",
	},
	2: {
		header: "authPage.signUp.emailHeader",
		subheader: "authPage.signUp.emailSubheader",
	},
	3: {
		header: "authPage.signUp.passwordHeader",
		subheader: "authPage.signUp.passwordSubheader",
	},
	4: {
		header: "authPage.verify.header",
		subheader: "authPage.verify.subheader",
	},
	5: {
		header: "authPage.signUp.selfieHeader",
		subheader: "authPage.signUp.selfieSubheader",
	},
	6: {
		header: "authPage.signUp.successHeader",
		subheader: "authPage.signUp.successSubheader",
	},
}

const forgotPasswordSteps: Record<number, Step> = {
	1: {
		header: "authPage.forgotPassword.header",
		subheader: "authPage.forgotPassword.subheader",
	},
	2: {
		header: "authPage.verify.header",
		subheader: "authPage.verify.subheader",
	},
	3: {
		header: "authPage.forgotPassword.passwordHeader",
		subheader: "authPage.forgotPassword.passwordSubheader",
	},
	4: {
		header: "authPage.forgotPassword.successHeader",
		subheader: "authPage.forgotPassword.successSubheader",
	},
}

export { forgotPasswordSteps, signUpSteps }
