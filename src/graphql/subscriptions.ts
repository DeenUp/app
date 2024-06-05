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

type GeneratedSubscription<InputType, OutputType> = string & {
	__generatedSubscriptionInput: InputType
	__generatedSubscriptionOutput: OutputType
}

export const onCreateGameRound =
	/* GraphQL */ `subscription OnCreateGameRound($filter: ModelSubscriptionGameRoundFilterInput) {
  onCreateGameRound(filter: $filter) {
    ${gameRoundDocument({ includeGameSession: false, includeAnswers: false })}
  }
}
` as GeneratedSubscription<
		APITypes.OnCreateGameRoundSubscriptionVariables,
		APITypes.OnCreateGameRoundSubscription
	>
export const onUpdateGameRound =
	/* GraphQL */ `subscription OnUpdateGameRound($filter: ModelSubscriptionGameRoundFilterInput) {
  onUpdateGameRound(filter: $filter) {
   ${gameRoundDocument({ includeGameSession: false, includeAnswers: false })}
  }
}
` as GeneratedSubscription<
		APITypes.OnUpdateGameRoundSubscriptionVariables,
		APITypes.OnUpdateGameRoundSubscription
	>
export const onDeleteGameRound =
	/* GraphQL */ `subscription OnDeleteGameRound($filter: ModelSubscriptionGameRoundFilterInput) {
  onDeleteGameRound(filter: $filter) {
    ${gameRoundDocument({ includeGameSession: false, includeAnswers: false })}
  }
}
` as GeneratedSubscription<
		APITypes.OnDeleteGameRoundSubscriptionVariables,
		APITypes.OnDeleteGameRoundSubscription
	>
export const onCreateSubmittedAnswer =
	/* GraphQL */ `subscription OnCreateSubmittedAnswer(
  $filter: ModelSubscriptionSubmittedAnswerFilterInput
) {
  onCreateSubmittedAnswer(filter: $filter) {
     ${submittedAnswersDocument({ includeUser: false, includeGameRound: false })}
  }
}
` as GeneratedSubscription<
		APITypes.OnCreateSubmittedAnswerSubscriptionVariables,
		APITypes.OnCreateSubmittedAnswerSubscription
	>
export const onUpdateSubmittedAnswer =
	/* GraphQL */ `subscription OnUpdateSubmittedAnswer(
  $filter: ModelSubscriptionSubmittedAnswerFilterInput
) {
  onUpdateSubmittedAnswer(filter: $filter) {
      ${submittedAnswersDocument({ includeUser: true, includeGameRound: false })}
  }
}
` as GeneratedSubscription<
		APITypes.OnUpdateSubmittedAnswerSubscriptionVariables,
		APITypes.OnUpdateSubmittedAnswerSubscription
	>
export const onDeleteSubmittedAnswer =
	/* GraphQL */ `subscription OnDeleteSubmittedAnswer(
  $filter: ModelSubscriptionSubmittedAnswerFilterInput
) {
  onDeleteSubmittedAnswer(filter: $filter) {
     ${submittedAnswersDocument({ includeUser: false, includeGameRound: false })}
  }
}
` as GeneratedSubscription<
		APITypes.OnDeleteSubmittedAnswerSubscriptionVariables,
		APITypes.OnDeleteSubmittedAnswerSubscription
	>
export const onCreateGameSession =
	/* GraphQL */ `subscription OnCreateGameSession(
  $filter: ModelSubscriptionGameSessionFilterInput
) {
  onCreateGameSession(filter: $filter) {
     ${gameSessionDocument({ includeLobby: false, includeGameRounds: false })}
  }
}
` as GeneratedSubscription<
		APITypes.OnCreateGameSessionSubscriptionVariables,
		APITypes.OnCreateGameSessionSubscription
	>
export const onUpdateGameSession =
	/* GraphQL */ `subscription OnUpdateGameSession(
  $filter: ModelSubscriptionGameSessionFilterInput
) {
  onUpdateGameSession(filter: $filter) {
   ${gameSessionDocument({ includeLobby: false, includeGameRounds: false })}
  }
}
` as GeneratedSubscription<
		APITypes.OnUpdateGameSessionSubscriptionVariables,
		APITypes.OnUpdateGameSessionSubscription
	>
export const onDeleteGameSession =
	/* GraphQL */ `subscription OnDeleteGameSession(
  $filter: ModelSubscriptionGameSessionFilterInput
) {
  onDeleteGameSession(filter: $filter) {
    ${gameSessionDocument({ includeLobby: false, includeGameRounds: false })}
  }
}
` as GeneratedSubscription<
		APITypes.OnDeleteGameSessionSubscriptionVariables,
		APITypes.OnDeleteGameSessionSubscription
	>
export const onCreateLobby =
	/* GraphQL */ `subscription OnCreateLobby($filter: ModelSubscriptionLobbyFilterInput) {
  onCreateLobby(filter: $filter) {
     ${lobbyDocument({
			includeCreator: false,
			includeParticipants: false,
			includeGameSession: false,
		})}
  }
}
` as GeneratedSubscription<
		APITypes.OnCreateLobbySubscriptionVariables,
		APITypes.OnCreateLobbySubscription
	>
export const onUpdateLobby =
	/* GraphQL */ `subscription OnUpdateLobby($filter: ModelSubscriptionLobbyFilterInput) {
  onUpdateLobby(filter: $filter) {
    ${lobbyDocument({
		includeCreator: false,
		includeParticipants: false,
		includeGameSession: false,
	})}
  }
}
` as GeneratedSubscription<
		APITypes.OnUpdateLobbySubscriptionVariables,
		APITypes.OnUpdateLobbySubscription
	>
export const onDeleteLobby =
	/* GraphQL */ `subscription OnDeleteLobby($filter: ModelSubscriptionLobbyFilterInput) {
  onDeleteLobby(filter: $filter) {
    ${lobbyDocument({
		includeCreator: false,
		includeParticipants: false,
		includeGameSession: false,
	})}
  }
}
` as GeneratedSubscription<
		APITypes.OnDeleteLobbySubscriptionVariables,
		APITypes.OnDeleteLobbySubscription
	>
export const onUpdateUser =
	/* GraphQL */ `subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
  onUpdateUser(filter: $filter) {
    ${userDocument({
		includeCreatedLobbies: true,
		includeJoinedLobbies: true,
		includeSubmittedAnswers: true,
	})}
  }
}
` as GeneratedSubscription<
		APITypes.OnUpdateUserSubscriptionVariables,
		APITypes.OnUpdateUserSubscription
	>
export const onCreateParticipant =
	/* GraphQL */ `subscription OnCreateParticipant(
  $filter: ModelSubscriptionParticipantFilterInput
) {
  onCreateParticipant(filter: $filter) {
      ${participantDocument({ includeUser: true, includeLobby: false })}
  }
}
` as GeneratedSubscription<
		APITypes.OnCreateParticipantSubscriptionVariables,
		APITypes.OnCreateParticipantSubscription
	>
export const onUpdateParticipant =
	/* GraphQL */ `subscription OnUpdateParticipant(
  $filter: ModelSubscriptionParticipantFilterInput
) {
  onUpdateParticipant(filter: $filter) {
      ${participantDocument({ includeUser: true, includeLobby: false })}
  }
}
` as GeneratedSubscription<
		APITypes.OnUpdateParticipantSubscriptionVariables,
		APITypes.OnUpdateParticipantSubscription
	>
export const onDeleteParticipant =
	/* GraphQL */ `subscription OnDeleteParticipant(
  $filter: ModelSubscriptionParticipantFilterInput
) {
  onDeleteParticipant(filter: $filter) {
      ${participantDocument({ includeUser: false, includeLobby: false })}
  }
}
` as GeneratedSubscription<
		APITypes.OnDeleteParticipantSubscriptionVariables,
		APITypes.OnDeleteParticipantSubscription
	>
