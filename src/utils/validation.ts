const validatePassword = (password?: string): string => {
	if (!password) return "Password is required"

	if (password.length < 8) return "Password must be at least 8 characters"

	return ""
}

const validateName = (name: string): string => {
	const nameRegex = /^[a-zA-Z0-9._-]{2,}$/

	if (!name) return "Name is required"

	if (name.length < 2) return "Name must be at least 2 characters"

	if (!nameRegex.test(name)) return "Name is invalid"

	return ""
}

const validateEmail = (email: string): string => {
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

	if (!email) return "Email is required"

	if (!email.includes("@")) return "Email is invalid"

	if (!emailRegex.test(email)) return "Email is invalid"

	return ""
}

const validateCode = (code: string | null): string => {
	if (!code) return "Code is required"

	if (code.length < 6) return "Code must be 6 characters"

	return ""
}

export { validateCode, validateEmail, validateName, validatePassword }
