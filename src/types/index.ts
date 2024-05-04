import type { GraphqlSubscriptionMessage, NeverEmpty } from "./amplify.type";
import type {
  CompleteApi,
  CreateMutationApi,
  CreateWithImageMutationApi,
  DeleteMutationApi,
  GetQueryApi,
  IGameSessionApi,
  ILobbyApi,
  IParticipantApi,
  IUserApi,
  ListByIdQueryApi,
  ListQueryApi,
  MutationApi,
  QueryApi,
  SubscriptionApi,
  UpdateMutationApi,
  UpdateWithImageMutationApi,
} from "./apis.type";
import type { Player, PossibleAnswer, Question } from "./game.type";
import type {
  ApiRequestType,
  ApiResponse,
  Fail,
  ItemResponse,
  ListByIdQueryParams,
  ListQueryParams,
  ListResponse,
  Maybe,
  Subscription,
  SubscriptionParams,
  SubscriptionResponse,
  Success,
} from "./helpers.type";
import type {
  AnalyticsService,
  GraphQLService,
  RestService,
  StorageService,
} from "./services.type";

export type Theme = {
  colors: {
    primary: string;
    background: string;
    surface: string;
    accent: string;
    // Add more colors as needed
  };
  // Add more theme properties as needed
};

export type {
  CompleteApi,
  CreateMutationApi,
  CreateWithImageMutationApi,
  DeleteMutationApi,
  GetQueryApi,
  IGameSessionApi,
  ILobbyApi,
  IParticipantApi,
  IUserApi,
  ListByIdQueryApi,
  ListQueryApi,
  MutationApi,
  QueryApi,
  SubscriptionApi,
  UpdateMutationApi,
  UpdateWithImageMutationApi,
  Player,
  PossibleAnswer,
  Question,
  ApiRequestType,
  ApiResponse,
  Fail,
  ItemResponse,
  ListByIdQueryParams,
  ListQueryParams,
  ListResponse,
  Maybe,
  Subscription,
  SubscriptionParams,
  SubscriptionResponse,
  Success,
  AnalyticsService,
  GraphQLService,
  RestService,
  StorageService,
  GraphqlSubscriptionMessage,
  NeverEmpty,
};
