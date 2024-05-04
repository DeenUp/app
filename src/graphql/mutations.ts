/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./api"
import {
	gameRoundDocument,
	gameSessionDocument,
	lobbyDocument,
	participantDocument,
	submittedAnswersDocument,
	userDocument,
} from "./documents"

type GeneratedMutation<InputType, OutputType> = string & {
	__generatedMutationInput: InputType
	__generatedMutationOutput: OutputType
}

export const createGameRound = /* GraphQL */ `mutation CreateGameRound(
  $input: CreateGameRoundInput!
  $condition: ModelGameRoundConditionInput
) {
  createGameRound(input: $input, condition: $condition) {
      ${gameRoundDocument({ includeGameSession: false, includeAnswers: false })}
  }
}
` as GeneratedMutation<
	APITypes.CreateGameRoundMutationVariables,
	APITypes.CreateGameRoundMutation
>
export const updateGameRound = /* GraphQL */ `mutation UpdateGameRound(
  $input: UpdateGameRoundInput!
  $condition: ModelGameRoundConditionInput
) {
  updateGameRound(input: $input, condition: $condition) {
    ${gameRoundDocument({ includeGameSession: false, includeAnswers: false })}
  }
}
` as GeneratedMutation<
	APITypes.UpdateGameRoundMutationVariables,
	APITypes.UpdateGameRoundMutation
>
export const deleteGameRound = /* GraphQL */ `mutation DeleteGameRound(
  $input: DeleteGameRoundInput!
  $condition: ModelGameRoundConditionInput
) {
  deleteGameRound(input: $input, condition: $condition) {
    ${gameRoundDocument({ includeGameSession: false, includeAnswers: false })}
  }
}
` as GeneratedMutation<
	APITypes.DeleteGameRoundMutationVariables,
	APITypes.DeleteGameRoundMutation
>
export const createSubmittedAnswer =
	/* GraphQL */ `mutation CreateSubmittedAnswer(
  $input: CreateSubmittedAnswerInput!
  $condition: ModelSubmittedAnswerConditionInput
) {
  createSubmittedAnswer(input: $input, condition: $condition) {
     ${submittedAnswersDocument({ includeUser: true, includeGameRound: false })}
  }
}
` as GeneratedMutation<
		APITypes.CreateSubmittedAnswerMutationVariables,
		APITypes.CreateSubmittedAnswerMutation
	>
export const updateSubmittedAnswer =
	/* GraphQL */ `mutation UpdateSubmittedAnswer(
  $input: UpdateSubmittedAnswerInput!
  $condition: ModelSubmittedAnswerConditionInput
) {
  updateSubmittedAnswer(input: $input, condition: $condition) {
    ${submittedAnswersDocument({ includeUser: true, includeGameRound: false })}
  }
}
` as GeneratedMutation<
		APITypes.UpdateSubmittedAnswerMutationVariables,
		APITypes.UpdateSubmittedAnswerMutation
	>
export const deleteSubmittedAnswer =
	/* GraphQL */ `mutation DeleteSubmittedAnswer(
  $input: DeleteSubmittedAnswerInput!
  $condition: ModelSubmittedAnswerConditionInput
) {
  deleteSubmittedAnswer(input: $input, condition: $condition) {
   ${submittedAnswersDocument({ includeUser: false, includeGameRound: false })}
  }
}
` as GeneratedMutation<
		APITypes.DeleteSubmittedAnswerMutationVariables,
		APITypes.DeleteSubmittedAnswerMutation
	>
export const createGameSession = /* GraphQL */ `mutation CreateGameSession(
  $input: CreateGameSessionInput!
  $condition: ModelGameSessionConditionInput
) {
  createGameSession(input: $input, condition: $condition) {
     ${gameSessionDocument({ includeLobby: false, includeGameRounds: false })}
  }
}
` as GeneratedMutation<
	APITypes.CreateGameSessionMutationVariables,
	APITypes.CreateGameSessionMutation
>
export const updateGameSession = /* GraphQL */ `mutation UpdateGameSession(
  $input: UpdateGameSessionInput!
  $condition: ModelGameSessionConditionInput
) {
  updateGameSession(input: $input, condition: $condition) {
    ${gameSessionDocument({ includeLobby: false, includeGameRounds: false })}
  }
}
` as GeneratedMutation<
	APITypes.UpdateGameSessionMutationVariables,
	APITypes.UpdateGameSessionMutation
>
export const deleteGameSession = /* GraphQL */ `mutation DeleteGameSession(
  $input: DeleteGameSessionInput!
  $condition: ModelGameSessionConditionInput
) {
  deleteGameSession(input: $input, condition: $condition) {
     ${gameSessionDocument({ includeLobby: false, includeGameRounds: false })}
  }
}
` as GeneratedMutation<
	APITypes.DeleteGameSessionMutationVariables,
	APITypes.DeleteGameSessionMutation
>
export const createLobby = /* GraphQL */ `mutation CreateLobby(
  $input: CreateLobbyInput!
  $condition: ModelLobbyConditionInput
) {
  createLobby(input: $input, condition: $condition) {
     ${lobbyDocument({
			includeCreator: false,
			includeParticipants: true,
			includeGameSession: false,
		})}
  }
}
` as GeneratedMutation<
	APITypes.CreateLobbyMutationVariables,
	APITypes.CreateLobbyMutation
>
export const updateLobby = /* GraphQL */ `mutation UpdateLobby(
  $input: UpdateLobbyInput!
  $condition: ModelLobbyConditionInput
) {
  updateLobby(input: $input, condition: $condition) {
    ${lobbyDocument({
		includeCreator: false,
		includeParticipants: false,
		includeGameSession: false,
	})}
  }
}
` as GeneratedMutation<
	APITypes.UpdateLobbyMutationVariables,
	APITypes.UpdateLobbyMutation
>
export const deleteLobby = /* GraphQL */ `mutation DeleteLobby(
  $input: DeleteLobbyInput!
  $condition: ModelLobbyConditionInput
) {
  deleteLobby(input: $input, condition: $condition) {
     ${lobbyDocument({
			includeCreator: false,
			includeParticipants: false,
			includeGameSession: false,
		})}
  }
}
` as GeneratedMutation<
	APITypes.DeleteLobbyMutationVariables,
	APITypes.DeleteLobbyMutation
>
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
   ${userDocument({
		includeCreatedLobbies: true,
		includeJoinedLobbies: true,
		includeSubmittedAnswers: true,
   })}
  }
}
` as GeneratedMutation<
	APITypes.UpdateUserMutationVariables,
	APITypes.UpdateUserMutation
>
export const createParticipant = /* GraphQL */ `mutation CreateParticipant(
  $input: CreateParticipantInput!
  $condition: ModelParticipantConditionInput
) {
  createParticipant(input: $input, condition: $condition) {
    ${participantDocument({ includeUser: true, includeLobby: false })} 
  }
}
` as GeneratedMutation<
	APITypes.CreateParticipantMutationVariables,
	APITypes.CreateParticipantMutation
>
export const updateParticipant = /* GraphQL */ `mutation UpdateParticipant(
  $input: UpdateParticipantInput!
  $condition: ModelParticipantConditionInput
) {
  updateParticipant(input: $input, condition: $condition) {
   ${participantDocument({ includeUser: true, includeLobby: false })} 
  }
}
` as GeneratedMutation<
	APITypes.UpdateParticipantMutationVariables,
	APITypes.UpdateParticipantMutation
>
export const deleteParticipant = /* GraphQL */ `mutation DeleteParticipant(
  $input: DeleteParticipantInput!
  $condition: ModelParticipantConditionInput
) {
  deleteParticipant(input: $input, condition: $condition) {
    ${participantDocument({ includeUser: false, includeLobby: false })} 
  }
}
` as GeneratedMutation<
	APITypes.DeleteParticipantMutationVariables,
	APITypes.DeleteParticipantMutation
>
