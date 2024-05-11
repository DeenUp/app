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

type GeneratedQuery<InputType, OutputType> = string & {
	__generatedQueryInput: InputType
	__generatedQueryOutput: OutputType
}

export const getGameRound = /* GraphQL */ `query GetGameRound($id: ID!) {
  getGameRound(id: $id) {
   ${gameRoundDocument({ includeGameSession: false, includeAnswers: false })}
  }
}
` as GeneratedQuery<
	APITypes.GetGameRoundQueryVariables,
	APITypes.GetGameRoundQuery
>
export const listGameRounds = /* GraphQL */ `query ListGameRounds(
  $filter: ModelGameRoundFilterInput
  $limit: Int
  $nextToken: String
) {
  listGameRounds(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
     ${gameRoundDocument({ includeGameSession: false, includeAnswers: false })}
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
	APITypes.ListGameRoundsQueryVariables,
	APITypes.ListGameRoundsQuery
>
export const getGameRoundByGameSessionID =
	/* GraphQL */ `query GetGameRoundByGameSessionID(
  $gameSessionID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelGameRoundFilterInput
  $limit: Int
  $nextToken: String
) {
  getGameRoundByGameSessionID(
    gameSessionID: $gameSessionID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
     ${gameRoundDocument({ includeGameSession: false, includeAnswers: false })}
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
		APITypes.GetGameRoundByGameSessionIDQueryVariables,
		APITypes.GetGameRoundByGameSessionIDQuery
	>
export const getSubmittedAnswer =
	/* GraphQL */ `query GetSubmittedAnswer($id: ID!) {
  getSubmittedAnswer(id: $id) {
   ${submittedAnswersDocument({ includeUser: true, includeGameRound: false })}
  }
}
` as GeneratedQuery<
		APITypes.GetSubmittedAnswerQueryVariables,
		APITypes.GetSubmittedAnswerQuery
	>
export const listSubmittedAnswers = /* GraphQL */ `query ListSubmittedAnswers(
  $filter: ModelSubmittedAnswerFilterInput
  $limit: Int
  $nextToken: String
) {
  listSubmittedAnswers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      ${submittedAnswersDocument({ includeUser: true, includeGameRound: false })}
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
	APITypes.ListSubmittedAnswersQueryVariables,
	APITypes.ListSubmittedAnswersQuery
>
export const getSubmittedAnswerByUserID =
	/* GraphQL */ `query GetSubmittedAnswerByUserID(
  $userID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelSubmittedAnswerFilterInput
  $limit: Int
  $nextToken: String
) {
  getSubmittedAnswerByUserID(
    userID: $userID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      ${submittedAnswersDocument({ includeUser: true, includeGameRound: false })}
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
		APITypes.GetSubmittedAnswerByUserIDQueryVariables,
		APITypes.GetSubmittedAnswerByUserIDQuery
	>
export const getSubmittedAnswerByGameRoundID =
	/* GraphQL */ `query GetSubmittedAnswerByGameRoundID(
  $gameRoundID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelSubmittedAnswerFilterInput
  $limit: Int
  $nextToken: String
) {
  getSubmittedAnswerByGameRoundID(
    gameRoundID: $gameRoundID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      ${submittedAnswersDocument({ includeUser: true, includeGameRound: false })}
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
		APITypes.GetSubmittedAnswerByGameRoundIDQueryVariables,
		APITypes.GetSubmittedAnswerByGameRoundIDQuery
	>
export const getGameSession = /* GraphQL */ `query GetGameSession($id: ID!) {
  getGameSession(id: $id) {
    ${gameSessionDocument({ includeLobby: false, includeGameRounds: false })}
  }
}
` as GeneratedQuery<
	APITypes.GetGameSessionQueryVariables,
	APITypes.GetGameSessionQuery
>
export const listGameSessions = /* GraphQL */ `query ListGameSessions(
  $filter: ModelGameSessionFilterInput
  $limit: Int
  $nextToken: String
) {
  listGameSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      ${gameSessionDocument({ includeLobby: false, includeGameRounds: false })}
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
	APITypes.ListGameSessionsQueryVariables,
	APITypes.ListGameSessionsQuery
>
export const getGameSessionByLobbyID =
	/* GraphQL */ `query GetGameSessionByLobbyID(
  $lobbyID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelGameSessionFilterInput
  $limit: Int
  $nextToken: String
) {
  getGameSessionByLobbyID(
    lobbyID: $lobbyID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      ${gameSessionDocument({ includeLobby: false, includeGameRounds: false })}
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
		APITypes.GetGameSessionByLobbyIDQueryVariables,
		APITypes.GetGameSessionByLobbyIDQuery
	>
export const getLobby = /* GraphQL */ `query GetLobby($id: ID!) {
  getLobby(id: $id) {
    ${lobbyDocument({
		includeCreator: false,
		includeParticipants: false,
		includeGameSession: false,
	})}
  }
}
` as GeneratedQuery<APITypes.GetLobbyQueryVariables, APITypes.GetLobbyQuery>
export const listLobbies = /* GraphQL */ `query ListLobbies(
  $filter: ModelLobbyFilterInput
  $limit: Int
  $nextToken: String
) {
  listLobbies(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      ${lobbyDocument({
			includeCreator: false,
			includeParticipants: false,
			includeGameSession: false,
		})}
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
	APITypes.ListLobbiesQueryVariables,
	APITypes.ListLobbiesQuery
>
export const getLobbyByCode = /* GraphQL */ `query GetLobbyByCode(
  $code: String!
  $sortDirection: ModelSortDirection
  $filter: ModelLobbyFilterInput
  $limit: Int
  $nextToken: String
) {
  getLobbyByCode(
    code: $code
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      ${lobbyDocument({
			includeCreator: false,
			includeParticipants: true,
			includeGameSession: false,
		})}
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
	APITypes.GetLobbyByCodeQueryVariables,
	APITypes.GetLobbyByCodeQuery
>
export const getLobbyByCreatorID = /* GraphQL */ `query GetLobbyByCreatorID(
  $creatorID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelLobbyFilterInput
  $limit: Int
  $nextToken: String
) {
  getLobbyByCreatorID(
    creatorID: $creatorID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
     ${lobbyDocument({
			includeCreator: false,
			includeParticipants: true,
			includeGameSession: false,
		})}
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
	APITypes.GetLobbyByCreatorIDQueryVariables,
	APITypes.GetLobbyByCreatorIDQuery
>
export const getLobbyByGameSessionID =
	/* GraphQL */ `query GetLobbyByGameSessionID(
  $gameSessionID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelLobbyFilterInput
  $limit: Int
  $nextToken: String
) {
  getLobbyByGameSessionID(
    gameSessionID: $gameSessionID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      ${lobbyDocument({
			includeCreator: false,
			includeParticipants: false,
			includeGameSession: false,
		})}
    nextToken
    __typename
  }
}
` as GeneratedQuery<
		APITypes.GetLobbyByGameSessionIDQueryVariables,
		APITypes.GetLobbyByGameSessionIDQuery
	>
export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
     ${userDocument({
			includeCreatedLobbies: true,
			includeJoinedLobbies: true,
			includeSubmittedAnswers: true,
		})}
  }
}
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
        ${userDocument({
			includeCreatedLobbies: false,
			includeJoinedLobbies: false,
			includeSubmittedAnswers: false,
		})}
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>
export const getUserByEmail = /* GraphQL */ `query GetUserByEmail(
  $email: AWSEmail!
  $sortDirection: ModelSortDirection
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  getUserByEmail(
    email: $email
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
        ${userDocument({
			includeCreatedLobbies: false,
			includeJoinedLobbies: false,
			includeSubmittedAnswers: false,
		})}
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
	APITypes.GetUserByEmailQueryVariables,
	APITypes.GetUserByEmailQuery
>
export const getParticipant = /* GraphQL */ `query GetParticipant($id: ID!) {
  getParticipant(id: $id) {
    ${participantDocument({ includeUser: true, includeLobby: true })} 
  }
}
` as GeneratedQuery<
	APITypes.GetParticipantQueryVariables,
	APITypes.GetParticipantQuery
>
export const listParticipants = /* GraphQL */ `query ListParticipants(
  $filter: ModelParticipantFilterInput
  $limit: Int
  $nextToken: String
) {
  listParticipants(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      ${participantDocument({ includeUser: true, includeLobby: false })}
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
	APITypes.ListParticipantsQueryVariables,
	APITypes.ListParticipantsQuery
>
export const participantsByLobbyId = /* GraphQL */ `query ParticipantsByLobbyId(
  $lobbyId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelParticipantFilterInput
  $limit: Int
  $nextToken: String
) {
  participantsByLobbyId(
    lobbyId: $lobbyId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
     ${participantDocument({ includeUser: true, includeLobby: false })}
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
	APITypes.ParticipantsByLobbyIdQueryVariables,
	APITypes.ParticipantsByLobbyIdQuery
>
export const participantsByUserId = /* GraphQL */ `query ParticipantsByUserId(
  $userId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelParticipantFilterInput
  $limit: Int
  $nextToken: String
) {
  participantsByUserId(
    userId: $userId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      ${participantDocument({ includeUser: true, includeLobby: true })}
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
	APITypes.ParticipantsByUserIdQueryVariables,
	APITypes.ParticipantsByUserIdQuery
>
