import type { DocumentNode } from "graphql";

import { generateClient } from "aws-amplify/api";

import type { GraphQLService } from "~types";

export default class AmplifyGraphqlService implements GraphQLService {
  private readonly client = generateClient();

  mutate = async <M, V, T>(mutation: M, variables: V): Promise<T> => {
    const response = await this.client.graphql({
      query: mutation as DocumentNode,
      variables,
    });

    return response as T;
  };

  query = async <Q, V, T>(query: Q, variables: V): Promise<T> => {
    const response = await this.client.graphql({
      query: query as DocumentNode,
      variables,
    });

    return response as T;
  };

  subscribe = <S, V, T>(subscription: S, variables: V): T => {
    const response = this.client.graphql({
      query: subscription as DocumentNode,
      variables,
    });

    return response as T;
  };
}
