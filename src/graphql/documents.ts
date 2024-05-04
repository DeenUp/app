const userDocument = (include: {
	includeCreatedLobbies: boolean
	includeJoinedLobbies: boolean
	includeSubmittedAnswers: boolean
}) => {
	let document = `
        id
        email
        name
        selfie
        status
        type
        updatedAt
        createdAt
        __typename
    `

	if (include.includeCreatedLobbies) {
		document += `createdLobbies {
            items {
                id
                code
                isActive
                creatorID
                gameSessionID
                updatedAt
                createdAt
                __typename
            }
            nextToken
            __typename
        }`
	}

	if (include.includeJoinedLobbies) {
		document += `joinedLobbies {
            items {
                id
                lobbyId
                userId
                createdAt
                updatedAt
                __typename
            }
            nextToken
            __typename
        }`
	}

	if (include.includeSubmittedAnswers) {
		document += `submittedAnswers {
            items {
                id
                answer
                isCorrect
                userID
                gameRoundID
                updatedAt
                createdAt
                __typename
            }
            nextToken
            __typename
        }`
	}

	return document
}

const lobbyDocument = (include: {
	includeCreator: boolean
	includeParticipants: boolean
	includeGameSession: boolean
}) => {
	let document = `
        id
        code
        isActive
        creatorID
        gameSessionID
        updatedAt
        createdAt
        __typename
    `
	if (include.includeCreator) {
		document += `creator {
            ${userDocument({
				includeCreatedLobbies: false,
				includeJoinedLobbies: false,
				includeSubmittedAnswers: false,
			})}
        }`
	}

	if (include.includeParticipants) {
		document += `participants {
            items {
               ${participantDocument({
					includeUser: true,
					includeLobby: false,
				})}
            }
            nextToken
            __typename
        }`
	}

	if (include.includeGameSession) {
		document += `gameSession {
            ${gameSessionDocument({ includeLobby: false, includeGameRounds: false })}
        }`
	}

	return document
}

const gameSessionDocument = (include: {
	includeLobby: boolean
	includeGameRounds: boolean
}) => {
	let document = `
        id
        lobbyID
        rounds {
            items {
                id
                index
                question
                correctAnswer
                isComplete
                gameSessionID
                updatedAt
                createdAt
                __typename
            }
            nextToken
            __typename
        }
        updatedAt
        createdAt
        __typename
    `

	if (include.includeGameRounds) {
		document += `rounds {
            items {
                id
                gameSessionID
                question
                correctAnswer
                updatedAt
                createdAt
                __typename
            }
            nextToken
            __typename
        }`
	}

	if (include.includeLobby) {
		document += `lobby {
            ${lobbyDocument({
				includeCreator: false,
				includeParticipants: false,
				includeGameSession: false,
			})}
        }`
	}

	return document
}

const gameRoundDocument = (include: {
	includeGameSession: boolean
	includeAnswers: boolean
}) => {
	let document = `
        id
        index
        question
        correctAnswer
        isComplete
        gameSessionID
        updatedAt
        createdAt
        __typename
    `
	if (include.includeGameSession) {
		document += `gameSession {
            ${gameSessionDocument({ includeGameRounds: false, includeLobby: false })}
        }`
	}

	if (include.includeAnswers) {
		document += `submittedAnswers {
            items {
                id
                answer
                isCorrect
                userID
                gameRoundID
                updatedAt
                createdAt
                __typename
            }
            nextToken
            __typename
        }`
	}

	return document
}

const submittedAnswersDocument = (include: {
	includeUser: boolean
	includeGameRound: boolean
}) => {
	let document = `
        id
        answer
        isCorrect
        userID
        gameRoundID
        updatedAt
        createdAt
        __typename
    `

	if (include.includeUser) {
		document += `user {
            ${userDocument({
				includeCreatedLobbies: false,
				includeJoinedLobbies: false,
				includeSubmittedAnswers: false,
			})}
        }`
	}

	if (include.includeGameRound) {
		document += `gameRound {
            ${gameRoundDocument({ includeGameSession: false, includeAnswers: false })}
        }`
	}

	return document
}

const participantDocument = (include: {
	includeUser: boolean
	includeLobby: boolean
}) => {
	let document = `
        id
        lobbyId
        userId
        createdAt
        updatedAt
        __typename
    `

	if (include.includeUser) {
		document += `user {
             ${userDocument({
					includeCreatedLobbies: false,
					includeJoinedLobbies: false,
					includeSubmittedAnswers: false,
				})}
        }`
	}

	if (include.includeLobby) {
		document += `lobby {
            ${lobbyDocument({
				includeCreator: false,
				includeParticipants: false,
				includeGameSession: false,
			})}
        }`
	}

	return document
}

export {
	userDocument,
	lobbyDocument,
	gameSessionDocument,
	gameRoundDocument,
	submittedAnswersDocument,
	participantDocument,
}
