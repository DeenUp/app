export type Question = {
	id: string
	question: string
	options: string[]
	correctAnswer: string
	userAnswer: string
}

export type PossibleAnswer = {
	userId: string
	answer: string
}

export type Player = {
	id: string
}
